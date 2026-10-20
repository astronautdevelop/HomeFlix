import {
  Controller,
  Post,
  Param,
  Get,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { MetadataManagerService } from './metadata-manager.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateMetadataResponse } from './dto/metadata.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ActorCacheService } from './actor-cache.service';

@Controller('metadata')
export class MetadataManagerController {
  constructor(
    private readonly metadataService: MetadataManagerService,
    private readonly prisma: PrismaService,
    private readonly actorCache: ActorCacheService,
  ) {}

  @Post('update/:mediaId')
  @HttpCode(HttpStatus.OK)
  async updateMediaMetadata(@Param('mediaId') mediaId: string): Promise<UpdateMetadataResponse> {
    return this.metadataService.updateMetadataForMedia(mediaId);
  }

  @Post('update-all')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAllMetadata(): Promise<{ message: string; result: any }> {
    const result = await this.metadataService.updateAllMetadata();
    return {
      message: 'Aggiornamento metadati avviato',
      result,
    };
  }

  @Get('status')
  async getMetadataStatus(): Promise<any> {
    const total = await this.prisma.media.count();
    const withLocal = await this.prisma.media.count({
      where: { metadataSource: 'local' },
    });
    const withTmdb = await this.prisma.media.count({
      where: { metadataSource: 'tmdb' },
    });
    const withDefault = await this.prisma.media.count({
      where: { metadataSource: 'default' },
    });

    return {
      total,
      local: withLocal,
      tmdb: withTmdb,
      default: withDefault,
    };
  }

  @Get('actor-image/:name')
  async getActorImage(@Param('name') name: string, @Res() res: Response): Promise<void> {
    try {
      const actorService = this.metadataService.getActorCacheService();
      const cachePath = actorService.getCachePath();
      // Crea un nome file sicuro basato sul nome dell'attore
      const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');
      const fileName = `${safeName}.jpg`;
      const filePath = path.join(cachePath, fileName);

      await fs.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      res.status(404).json({ error: 'Immagine non trovata' });
    }
  }

  /**
   * POST /metadata/actors/cleanup
   * Esegue manualmente la garbage collection delle immagini degli attori
   */
  @Post('actors/cleanup')
  async cleanupActorImages() {
    const result = await this.actorCache.runGarbageCollection();
    return {
      message: 'Garbage Collection completata',
      deleted: result.deleted,
      errors: result.errors,
    };
  }

  /**
   * GET /metadata/actors/stats
   * Restituisce statistiche sulle immagini degli attori in cache
   */
  @Get('actors/stats')
  async getActorCacheStats() {
    const cachePath = this.actorCache.getCachePath();
    let count = 0;
    let size = 0;

    try {
      const files = await fs.readdir(cachePath);
      for (const file of files) {
        if (file.startsWith('.')) continue;
        const stat = await fs.stat(path.join(cachePath, file));
        count++;
        size += stat.size;
      }
    } catch {
      // Cartella non esiste
    }

    return {
      totalImages: count,
      totalSizeMB: Math.round(size / (1024 * 1024) * 100) / 100,
      cachePath,
    };
  }
}