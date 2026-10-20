// player-engine.service.ts (COMPLETO)

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageManagerService } from '../storage-manager/storage-manager.service';
import { CoreService } from '../../core/core.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { QualityInfoDto, MediaInfoDto } from './dto/play-request.dto';

@Injectable()
export class PlayerEngineService {
  private readonly logger = new Logger(PlayerEngineService.name);

  private readonly MIME_TYPES: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.srt': 'text/plain',
    '.vtt': 'text/vtt',
    '.ass': 'text/plain',
  };

  constructor(
    private prisma: PrismaService,
    private storageManager: StorageManagerService,
    private coreService: CoreService,
  ) {}

  async getMediaInfo(mediaId: string): Promise<MediaInfoDto> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { versions: true },
    });

    if (!media) {
      throw new NotFoundException(`Media ${mediaId} non trovato`);
    }

    const qualities: QualityInfoDto[] = media.versions.map((version) => ({
      quality: version.quality,
      filePath: version.filePath,
      size: Number(version.size) || 0,
      mimeType: this.getMimeType(version.filePath),
    }));

    return {
      id: media.id,
      title: media.title,
      type: media.type,
      qualities,
    };
  }

  async getAvailableQualities(mediaId: string): Promise<QualityInfoDto[]> {
    const info = await this.getMediaInfo(mediaId);
    return info.qualities;
  }

  async getVersionFilePath(mediaId: string, quality: string): Promise<string | null> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { versions: true },
    });

    if (!media) {
      throw new NotFoundException(`Media ${mediaId} non trovato`);
    }

    if (!media.available) {
      throw new NotFoundException('Il file non è più disponibile sul disco');
    }

    if (!quality) {
      const sortedVersions = media.versions.sort((a, b) => {
        const order = ['4K', 'Full HD', 'HD', 'DVD', 'SD'];
        return order.indexOf(a.quality) - order.indexOf(b.quality);
      });
      const bestVersion = sortedVersions[0];
      if (!bestVersion) return null;
      const exists = await this.storageManager.fileExists(bestVersion.filePath);
      if (!exists) {
        throw new NotFoundException(`File non trovato per la qualità ${bestVersion.quality}`);
      }
      return bestVersion.filePath;
    }

    const version = media.versions.find(v => v.quality === quality);
    if (!version) {
      return null;
    }

    const exists = await this.storageManager.fileExists(version.filePath);
    if (!exists) {
      throw new NotFoundException(`File non trovato per la qualità ${quality}`);
    }

    return version.filePath;
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.avi') {
      return 'video/mp4';
    }
    return this.MIME_TYPES[ext] || 'application/octet-stream';
  }

  async streamVideo(
    mediaId: string,
    quality: string,
    req: any,
    res: Response,
  ): Promise<void> {
    try {
      const filePath = await this.getVersionFilePath(mediaId, quality);
      if (!filePath) {
        this.logger.warn(`File non trovato per media ${mediaId}, qualità ${quality}`);
        res.status(404).json({ error: 'File non trovato o qualità non disponibile' });
        return;
      }

      this.logger.log(`🔍 Streaming file: ${filePath}`);

      const stats = await this.storageManager.getFileStats(filePath);
      if (!stats) {
        this.logger.error(`File stats non trovato: ${filePath}`);
        res.status(404).send('File non trovato');
        return;
      }

      const fileSize = stats.size;
      const mimeType = this.getMimeType(filePath);
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        if (start >= fileSize || end >= fileSize) {
          res.status(416).set('Content-Range', `bytes */${fileSize}`).send();
          return;
        }

        const stream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': mimeType,
          'Cache-Control': 'no-cache',
        });
        stream.pipe(res);
      } else {
        const stream = fs.createReadStream(filePath);
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': mimeType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache',
        });
        stream.pipe(res);
      }
    } catch (error) {
      this.logger.error(`Errore streaming video ${mediaId}`, error.stack);
      if (error instanceof NotFoundException) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send('Errore durante lo streaming');
      }
    }
  }

  async getSubtitles(mediaId: string, language: string = 'it'): Promise<{ content: string; mimeType: string } | null> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { versions: true },
    });

    if (!media || !media.versions || media.versions.length === 0) {
      throw new NotFoundException(`Media ${mediaId} non trovato o senza versioni`);
    }

    const filePath = media.versions[0].filePath;
    const folderPath = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));

    const subtitleExtensions = ['.srt', '.vtt', '.ass'];
    const patterns = [
      `${fileName}.${language}`,
      `${fileName}_${language}`,
      `${fileName}`,
    ];

    for (const ext of subtitleExtensions) {
      for (const pattern of patterns) {
        const subPath = path.join(folderPath, `${pattern}${ext}`);
        try {
          await fs.promises.access(subPath);
          const content = await fs.promises.readFile(subPath, 'utf-8');
          const mimeType = this.getMimeType(subPath);
          return { content, mimeType };
        } catch {
          // File non trovato, continua
        }
      }
    }

    return null;
  }

  async getAudioTracks(mediaId: string): Promise<{ language: string; label: string }[]> {
    return [
      { language: 'it', label: 'Italiano' },
      { language: 'en', label: 'Inglese' },
      { language: 'original', label: 'Originale' },
    ];
  }

  // ============================================================
  // 🔥 NAVIGAZIONE EPISODI (precedente / successivo)
  // ============================================================

  /**
   * Dato un episodio, restituisce l'episodio precedente e successivo
   * all'interno della stessa serie, ordinati per (seasonNumber, episodeNumber).
   * Funziona anche attraverso i confini di stagione.
   */
  async getEpisodeNavigation(mediaId: string): Promise<{
    previous: EpisodeNavItem | null;
    next: EpisodeNavItem | null;
  }> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { season: true, series: true },
    });

    // Se non è un episodio, o non appartiene a una serie → nessuna navigazione
    if (!media || media.type !== 'EPISODE' || !media.seriesId) {
      return { previous: null, next: null };
    }

    const episodes = await this.prisma.media.findMany({
      where: { seriesId: media.seriesId, type: 'EPISODE' },
      include: { season: true },
    });

    // Ordina per stagione, poi per numero episodio (gestendo i null)
    episodes.sort((a, b) => {
      const sa = a.season?.seasonNumber ?? 0;
      const sb = b.season?.seasonNumber ?? 0;
      if (sa !== sb) return sa - sb;
      return (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0);
    });

    const currentIndex = episodes.findIndex((e) => e.id === mediaId);
    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    const seriesTitle = media.series?.title ?? null;

    const mapEpisode = (ep: typeof episodes[number]): EpisodeNavItem => ({
      id: ep.id,
      title: ep.title,
      originalTitle: ep.originalTitle ?? null,
      episodeNumber: ep.episodeNumber ?? null,
      seasonNumber: ep.season?.seasonNumber ?? null,
      seasonId: ep.seasonId ?? null,
      seriesTitle,
    });

    return {
      previous: currentIndex > 0 ? mapEpisode(episodes[currentIndex - 1]) : null,
      next:
        currentIndex < episodes.length - 1
          ? mapEpisode(episodes[currentIndex + 1])
          : null,
    };
  }
}

export interface EpisodeNavItem {
  id: string;
  title: string;
  originalTitle: string | null;
  episodeNumber: number | null;
  seasonNumber: number | null;
  seasonId: string | null;
  seriesTitle: string | null;
}