import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';

export interface MissingMetadataItem {
  mediaId: string;
  title: string;
  type: string;
  missing: string[];
}

export interface MissingImageItem {
  mediaId: string;
  title: string;
  type: string;
  currentPath: string | null;
}

export interface DuplicateGroup {
  hash: string;
  count: number;
  items: { mediaId: string; title: string; filePath: string; quality: string }[];
}

export interface BrokenFileItem {
  mediaId: string;
  title: string;
  filePath: string;
  quality: string;
}

export interface UnavailableItem {
  mediaId: string;
  title: string;
  type: string;
  folderPath: string | null;
}

export interface HealthReport {
  totalMedia: number;

  missingMetadata: number;
  missingMetadataItems: MissingMetadataItem[];

  missingPoster: number;
  missingPosterItems: MissingImageItem[];

  missingBackground: number;
  missingBackgroundItems: MissingImageItem[];

  duplicates: DuplicateGroup[];

  brokenFiles: BrokenFileItem[];

  unavailableMedia: number;
  unavailableMediaItems: UnavailableItem[];

  scanTimestamp: string;
}

@Injectable()
export class HealthCheckService {
  constructor(private prisma: PrismaService) {}

  private fileExists(p: string | null | undefined): boolean {
    if (!p || p.trim() === '') return false;
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  }

  async generateReport(): Promise<HealthReport> {
    const mediaList = await this.prisma.media.findMany({
      include: { versions: true },
    });

    const totalMedia = mediaList.length;

    const missingMetadataItems: MissingMetadataItem[] = [];
    const missingPosterItems: MissingImageItem[] = [];
    const missingBackgroundItems: MissingImageItem[] = [];
    const brokenFiles: BrokenFileItem[] = [];
    const unavailableMediaItems: UnavailableItem[] = [];

    for (const media of mediaList) {
      // ===== Disponibilità =====
      if ((media as any).available === false) {
        unavailableMediaItems.push({
          mediaId: media.id,
          title: media.title,
          type: media.type,
          folderPath: media.folderPath ?? null,
        });
      }

      // ===== Poster (file fisico) =====
      const hasPoster = this.fileExists(media.posterUrl);
      if (!hasPoster) {
        missingPosterItems.push({
          mediaId: media.id,
          title: media.title,
          type: media.type,
          currentPath: media.posterUrl ?? null,
        });
      }

      // ===== Background (file fisico) =====
      const hasBackground = this.fileExists(media.backgroundUrl);
      if (!hasBackground) {
        missingBackgroundItems.push({
          mediaId: media.id,
          title: media.title,
          type: media.type,
          currentPath: media.backgroundUrl ?? null,
        });
      }

      // ===== Metadati =====
      const missingFields: string[] = [];
      if (!media.plot || media.plot === 'Nessuna trama disponibile') missingFields.push('Trama');
      if (!media.rating || media.rating === 0) missingFields.push('Rating');
      if (
        !media.genres ||
        (Array.isArray(media.genres) && media.genres.length === 0)
      )
        missingFields.push('Generi');
      if (!media.director || media.director.trim() === '')
        missingFields.push('Regista');
      if (!media.releaseYear) missingFields.push('Anno');
      if (!hasPoster) missingFields.push('Poster');
      if (!hasBackground) missingFields.push('Background');

      if (missingFields.length > 0) {
        missingMetadataItems.push({
          mediaId: media.id,
          title: media.title,
          type: media.type,
          missing: missingFields,
        });
      }

      // ===== File rotti =====
      for (const version of media.versions) {
        if (version.filePath && !this.fileExists(version.filePath)) {
          brokenFiles.push({
            mediaId: media.id,
            title: media.title,
            filePath: version.filePath,
            quality: version.quality,
          });
        }
      }
    }

    // ===== Duplicati (letti dall'ultima scansione completata) =====
    // Nota: Media.hash è @unique, quindi il DB non può contenere due record
    // con lo stesso hash. I duplicati vengono tracciati durante la scansione
    // e salvati in ScanLog.details.duplicates.
    const lastScan = await this.prisma.scanLog.findFirst({
      orderBy: { startedAt: 'desc' },
      where: { status: 'completed' },
    });

    const duplicates: DuplicateGroup[] = [];
    const rawDups = (lastScan?.details as any)?.duplicates;
    if (Array.isArray(rawDups)) {
      for (const entry of rawDups) {
        if (!entry?.files || !Array.isArray(entry.files)) continue;
        duplicates.push({
          hash: entry.hash ?? '',
          count: entry.files.length,
          items: entry.files.map((f: any) => ({
            mediaId: '',
            title: f.title ?? '(senza titolo)',
            filePath: f.filePath ?? '',
            quality: f.quality ?? '-',
          })),
        });
      }
    }

    return {
      totalMedia,

      missingMetadata: missingMetadataItems.length,
      missingMetadataItems,

      missingPoster: missingPosterItems.length,
      missingPosterItems,

      missingBackground: missingBackgroundItems.length,
      missingBackgroundItems,

      duplicates,

      brokenFiles,

      unavailableMedia: unavailableMediaItems.length,
      unavailableMediaItems,

      scanTimestamp: new Date().toISOString(),
    };
  }
}