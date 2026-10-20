// player-engine.controller.ts (COMPLETO)

import { Controller, Get, Post, Body, Param, Query, Res, Req, NotFoundException } from '@nestjs/common';
import { PlayerEngineService } from './player-engine.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { Response, Request } from 'express';
import { QualityInfoDto, MediaInfoDto } from './dto/play-request.dto';

interface SaveProgressDto {
  mediaId: string;
  progress: number;
  quality?: string;
  duration?: number;
}

@Controller('player')
export class PlayerEngineController {
  constructor(
    private readonly playerService: PlayerEngineService,
    private readonly prisma: PrismaService,
  ) {}

  // ========================================
  // 🔹 ROUTE STATICHE (DEVONO ESSERE PRIMA)
  // ========================================

  @Get('info/:mediaId')
  async getMediaInfo(@Param('mediaId') mediaId: string): Promise<MediaInfoDto> {
    return this.playerService.getMediaInfo(mediaId);
  }

  @Get('qualities/:mediaId')
  async getQualities(@Param('mediaId') mediaId: string): Promise<QualityInfoDto[]> {
    return this.playerService.getAvailableQualities(mediaId);
  }

  // 🔥 NAVIGAZIONE EPISODI (precedente / successivo)
  @Get('episode-nav/:mediaId')
  async getEpisodeNavigation(@Param('mediaId') mediaId: string) {
    return this.playerService.getEpisodeNavigation(mediaId);
  }

  @Get('play/:mediaId')
  async playVideo(
    @Param('mediaId') mediaId: string,
    @Query('quality') quality: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.playerService.streamVideo(mediaId, quality, req, res);
  }

  @Get('subtitles/:mediaId')
  async getSubtitles(
    @Param('mediaId') mediaId: string,
    @Query('lang') language: string = 'it',
    @Res() res: Response,
  ): Promise<void> {
    const subtitles = await this.playerService.getSubtitles(mediaId, language);
    if (!subtitles) {
      res.status(404).send('Sottotitoli non trovati');
      return;
    }
    res.setHeader('Content-Type', subtitles.mimeType);
    res.send(subtitles.content);
  }

  @Get('audio/:mediaId')
  async getAudioTracks(@Param('mediaId') mediaId: string): Promise<{ language: string; label: string }[]> {
    return this.playerService.getAudioTracks(mediaId);
  }

  // ========================================
  // 🔹 ROUTE PER IL PROGRESSO (STATICHE)
  // ========================================

  @Post('progress')
  async saveProgress(@Body() body: SaveProgressDto) {
    const { mediaId, progress, quality, duration } = body;

    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException('Media non trovato');
    }

    const totalDuration = duration || (media.runtime ? media.runtime * 60 : 0);
    const progressPercent = totalDuration > 0 ? (progress / totalDuration) * 100 : 0;

    // 🔥 Recupera lo stato precedente per rilevare il completamento
    const existing = await this.prisma.watchHistory.findFirst({
      where: { mediaId },
    });
    const prevProgress = existing?.progress ?? 0;
    const prevPercent = totalDuration > 0 ? (prevProgress / totalDuration) * 100 : 0;

    // 🔥 Visione completata: transizione da <85% a >=85% con progresso precedente valido
    const justCompleted =
      progressPercent >= 85 && prevPercent < 85 && prevProgress > 0;

    if (justCompleted) {
      await this.prisma.media.update({
        where: { id: mediaId },
        data: { viewCount: { increment: 1 } },
      });
    }

    const shouldSave = progressPercent >= 2 && progressPercent <= 85;

    if (!shouldSave) {
      await this.prisma.watchHistory.deleteMany({
        where: { mediaId },
      });
      return {
        success: true,
        message: justCompleted
          ? 'Visione completata registrata'
          : 'Progresso rimosso (fuori soglia 2%-85%)',
        progressPercent,
        action: justCompleted ? 'completed' : 'removed',
      };
    }

    if (existing) {
      await this.prisma.watchHistory.update({
        where: { id: existing.id },
        data: {
          progress,
          quality: quality || null,
          watchedAt: new Date(),
        },
      });
    } else {
      await this.prisma.watchHistory.create({
        data: {
          mediaId,
          progress,
          quality: quality || null,
          watchedAt: new Date(),
        },
      });
    }

    const allHistory = await this.prisma.watchHistory.findMany({
      orderBy: { watchedAt: 'desc' },
    });

    if (allHistory.length > 10) {
      const toDelete = allHistory.slice(10);
      const idsToDelete = toDelete.map((h) => h.id);
      await this.prisma.watchHistory.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    return {
      success: true,
      message: 'Progresso salvato',
      progressPercent,
      action: 'saved',
    };
  }

  @Get('continue-watching')
  async getContinueWatching() {
    const history = await this.prisma.watchHistory.findMany({
      where: { progress: { gt: 0 } },
      include: {
        media: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            backgroundUrl: true,
            releaseYear: true,
            rating: true,
            type: true,
            runtime: true,
          },
        },
      },
      orderBy: { watchedAt: 'desc' },
      take: 10,
    });

    return history.map((h) => {
      const runtimeMinutes = h.media.runtime || 0;
      const runtimeSeconds = runtimeMinutes * 60;
      const progress = h.progress ?? 0;

      const progressPercent = runtimeSeconds > 0 ? (progress / runtimeSeconds) * 100 : 0;

      const remainingSeconds = Math.max(0, runtimeSeconds - progress);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      return {
        ...h.media,
        progress,
        progressPercent: Math.min(progressPercent, 100),
        remainingMinutes,
        quality: h.quality,
        watchedAt: h.watchedAt,
      };
    });
  }

  @Get('progress/:mediaId')
  async getProgress(@Param('mediaId') mediaId: string) {
    const history = await this.prisma.watchHistory.findFirst({
      where: { mediaId },
    });
    return { progress: history?.progress || 0 };
  }
}