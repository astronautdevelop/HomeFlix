import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageManagerService } from '../storage-manager/storage-manager.service';
import { CoreService } from '../../core/core.service';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';
import { NotificationManagerGateway } from '../notification-manager/notification-manager.gateway';
import { MetadataManagerService } from '../metadata-manager/metadata-manager.service';
import { ScanResultDto } from './dto/scan-result.dto';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';

type DuplicateEntry = { filePath: string; title: string; quality: string };
type DuplicateTracker = Map<string, DuplicateEntry[]>;

@Injectable()
export class MediaScannerService {
  private readonly VIDEO_EXTENSIONS = new Set([
    '.mkv', '.mp4', '.avi', '.mov', '.m4v', '.webm',
  ]);

  private readonly QUALITY_PATTERNS: Record<string, string> = {
    '4k': '4K',
    '2160p': '4K',
    'uhd': '4K',
    '2160': '4K',
    '1080p': 'Full HD',
    '1080': 'Full HD',
    'fhd': 'Full HD',
    'bluray': 'Full HD',
    'blu-ray': 'Full HD',
    'bd': 'Full HD',
    'brrip': 'Full HD',
    '720p': 'HD',
    '720': 'HD',
    'hd': 'HD',
    'dvd': 'DVD',
    '480p': 'SD',
    '480': 'SD',
    'sd': 'SD',
  };

  private readonly SEASON_EPISODE_PATTERNS = [
    /[Ss](\d+)[Ee](\d+)/,
    /(\d+)x(\d+)/,
    /Episode\s*(\d+)/i,
  ];

  // 🔥 Flag in-memory per sapere se una scansione è in corso
  private isScanning = false;

  constructor(
    private prisma: PrismaService,
    private storageManager: StorageManagerService,
    private coreService: CoreService,
    private notificationService: NotificationManagerService,
    private notificationGateway: NotificationManagerGateway,
    private metadataManager: MetadataManagerService,
  ) {}

  // 🔥 Getter per esporre lo stato al controller
  getIsScanning(): boolean {
    return this.isScanning;
  }

  // ================================
  // SCANSIONE PRINCIPALE
  // ================================

  async scanAllDevices(): Promise<ScanResultDto> {
    // 🛡️ Evita scansioni concorrenti
    if (this.isScanning) {
      this.coreService.log('⚠️ Scansione già in corso, richiesta ignorata');
      throw new Error('Scansione già in corso');
    }

    this.isScanning = true;

    // 🔔 Notifica WebSocket: scansione avviata
    this.notificationGateway.emitScanStarted({
      startedAt: new Date().toISOString(),
    });

    try {
      const totalResult: ScanResultDto = {
        added: 0,
        removed: 0,
        updated: 0,
        errors: [],
      };

      const encounteredMediaIds = new Set<string>();
      let missingMetadataCount = 0;

      const addedTitles: string[] = [];
      const updatedTitles: string[] = [];

      // 🆕 Tracker duplicati rilevati in questa scansione
      const duplicateTracker: DuplicateTracker = new Map();

      const devices = this.storageManager.getAvailableDevices();
      this.coreService.log(`🔄 Scansione avviata su ${devices.length} dispositivi`);

      if (devices.length === 0) {
        await this.notificationService.notify(
          'warning',
          'Nessun percorso media configurato. Vai in Impostazioni per aggiungere i dischi.',
          { reason: 'no_media_roots' },
        );
        return totalResult;
      }

      for (const device of devices) {
        try {
          this.coreService.log(`📁 Scansione di ${device.path}`);
          const result = await this.scanDirectoryRecursive(
            device.path,
            false,
            encounteredMediaIds,
            addedTitles,
            updatedTitles,
            duplicateTracker,
          );
          totalResult.added += result.added;
          totalResult.removed += result.removed;
          totalResult.updated += result.updated;
          totalResult.errors.push(...result.errors);
        } catch (error) {
          const msg = `❌ Errore critico su ${device.path}: ${error.message}`;
          totalResult.errors.push(msg);
          await this.notificationService.notify(
            'error',
            msg,
            { device: device.path, error: error.stack },
          );
        }
      }

      await this.updateUnavailableMedia(encounteredMediaIds);

      if (totalResult.added > 0) {
        missingMetadataCount = await this.prisma.media.count({
          where: { metadataSource: 'default' },
        });
      }

      // 🆕 Calcolo duplicati rilevati
      const duplicatesDetected = Array.from(duplicateTracker.entries())
        .filter(([, files]) => files.length > 1)
        .map(([hash, files]) => ({ hash, files }));

      await this.notificationService.notify(
        'success',
        `Scansione completata: ${totalResult.added} nuovi, ${totalResult.updated} aggiornati`,
        {
          added: totalResult.added,
          updated: totalResult.updated,
          errors: totalResult.errors.length,
        },
      );

      if (addedTitles.length > 0 || updatedTitles.length > 0) {
        await this.notificationService.notify(
          'detail',
          'Film scansionati',
          {
            added: addedTitles,
            updated: updatedTitles,
          },
        );
      }

      if (missingMetadataCount > 0) {
        await this.notificationService.notify(
          'warning',
          `${missingMetadataCount} media senza metadati TMDB`,
          { count: missingMetadataCount },
        );
      }

      if (duplicatesDetected.length > 0) {
        await this.notificationService.notify(
          'warning',
          `${duplicatesDetected.length} duplicati rilevati (file identici in più cartelle/dischi)`,
          { duplicates: duplicatesDetected },
        );
        this.coreService.log(
          `⚠️ ${duplicatesDetected.length} duplicati rilevati in scansione`,
        );
      }

      if (totalResult.errors.length > 0) {
        await this.notificationService.notify(
          'warning',
          `Scansione con ${totalResult.errors.length} errori`,
          { errors: totalResult.errors.length },
        );
      }

      this.notificationGateway.emitScanCompleted({
        added: totalResult.added,
        removed: totalResult.removed,
        updated: totalResult.updated,
        errors: totalResult.errors.length,
      });

      await this.prisma.scanLog.create({
        data: {
          status: totalResult.errors.length > 0 ? 'failed' : 'completed',
          details: {
            added: totalResult.added,
            removed: totalResult.removed,
            updated: totalResult.updated,
            errors: totalResult.errors.length,
            duplicates: duplicatesDetected,
          },
          type: 'full',
        },
      });

      this.coreService.log(
        `✅ Scansione completata: ${totalResult.added} aggiunti, ${totalResult.updated} aggiornati`,
      );
      return totalResult;
    } finally {
      // 🔓 Rilascia il flag in qualsiasi caso (successo, errore, early return)
      this.isScanning = false;
    }
  }

  // ================================
  // AGGIORNAMENTO MEDIA NON DISPONIBILI
  // ================================

  private async updateUnavailableMedia(encounteredIds: Set<string>) {
    try {
      const allMedia = await this.prisma.media.findMany({
        select: { id: true, available: true },
      });

      const toUpdate = allMedia.filter(
        (m) => !encounteredIds.has(m.id) && m.available !== false,
      );

      if (toUpdate.length === 0) {
        this.coreService.log('✅ Tutti i media sono stati incontrati, nessun aggiornamento necessario');
        return;
      }

      this.coreService.log(
        `🔴 ${toUpdate.length} media non trovati, verranno marcati come non disponibili`,
      );

      await this.prisma.$transaction(
        toUpdate.map((m) =>
          this.prisma.media.update({
            where: { id: m.id },
            data: { available: false },
          }),
        ),
      );

      this.coreService.log(`✅ ${toUpdate.length} media marcati come non disponibili`);

      try {
        await this.notificationService.notify(
          'warning',
          `${toUpdate.length} media non più disponibili (dischi scollegati?)`,
          { count: toUpdate.length, unavailable: toUpdate.length },
        );
      } catch (err) {
        this.coreService.error('Errore invio notifica dischi scollegati', err?.stack);
      }
    } catch (error) {
      this.coreService.error(
        '❌ Errore durante l\'aggiornamento dei media non disponibili',
        error.stack,
      );
    }
  }

  // ================================
  // SCANSIONE RICORSIVA
  // ================================

  private async scanDirectoryRecursive(
    dirPath: string,
    isPersonalRoot: boolean = false,
    encounteredIds: Set<string>,
    addedTitles: string[],
    updatedTitles: string[],
    duplicateTracker: DuplicateTracker,
  ): Promise<{ added: number; removed: number; updated: number; errors: string[] }> {
    const result = {
      added: 0,
      removed: 0,
      updated: 0,
      errors: [] as string[],
    };

    try {
      const entries = await this.storageManager.listDirectory(dirPath);

      const files: string[] = [];
      const folders: string[] = [];

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = await this.storageManager.getFileStats(fullPath);
        if (stat && stat.isDirectory()) {
          folders.push(entry);
        } else {
          files.push(entry);
        }
      }

      const videoFiles = files.filter((f) => this.isVideoFile(f));
      if (videoFiles.length > 0) {
        const subResult = await this.processMediaFolder(
          dirPath,
          videoFiles,
          isPersonalRoot,
          encounteredIds,
          addedTitles,
          updatedTitles,
          duplicateTracker,
        );
        result.added += subResult.added;
        result.updated += subResult.updated;
        result.errors.push(...subResult.errors);
      }

      for (const folder of folders) {
        const subPath = path.join(dirPath, folder);
        const subResult = await this.scanDirectoryRecursive(
          subPath,
          isPersonalRoot,
          encounteredIds,
          addedTitles,
          updatedTitles,
          duplicateTracker,
        );
        result.added += subResult.added;
        result.removed += subResult.removed;
        result.updated += subResult.updated;
        result.errors.push(...subResult.errors);
      }
    } catch (error) {
      result.errors.push(`❌ Errore scansione ${dirPath}: ${error.message}`);
    }

    return result;
  }

  // ================================
  // ELABORAZIONE DI UNA CARTELLA MEDIA
  // ================================

  private async processMediaFolder(
    folderPath: string,
    videoFiles: string[],
    isPersonalRoot: boolean,
    encounteredIds: Set<string>,
    addedTitles: string[],
    updatedTitles: string[],
    duplicateTracker: DuplicateTracker,
  ): Promise<{ added: number; updated: number; errors: string[] }> {

    const result = { added: 0, updated: 0, errors: [] as string[] };

    const isSingleMovie = videoFiles.length === 1;

    for (const filename of videoFiles) {
      try {
        const filePath = path.join(folderPath, filename);
        const stats = await this.storageManager.getFileStats(filePath);
        if (!stats || !stats.isFile()) continue;

        const hash = await this.computeFileHash(filePath);
        const quality = this.extractQuality(filename);
        let mediaType = this.determineMediaType(filename);

        let seasonNumber: number | undefined;
        let episodeNumber: number | undefined;
        let seriesTitle: string | undefined;

        const isEpisodePattern = this.isSeriesFile(filename);

        if (isSingleMovie && !isEpisodePattern) {
          mediaType = 'MOVIE';
          const folderName = path.basename(folderPath);
          const cleanFolderName = this.normalizeName(folderName);
        } else if (mediaType === 'EPISODE') {
          const info = this.parseSeriesInfo(filename);
          if (info) {
            seasonNumber = info.season;
            episodeNumber = info.episode;
          }

          const seriesTitleFromFile = this.extractSeriesTitleFromFilename(filename);
          if (seriesTitleFromFile) {
            seriesTitle = seriesTitleFromFile;
          } else {
            const parentDir = path.basename(path.dirname(filePath));
            seriesTitle = this.normalizeName(parentDir);
          }
        }

        let cleanTitle = this.extractCleanTitle(filename);

        if (
          mediaType === 'MOVIE' &&
          (cleanTitle === 'Untitled' ||
            cleanTitle.toLowerCase() === 'video' ||
            cleanTitle.toLowerCase() === 'movie')
        ) {
          const folderName = path.basename(folderPath);
          cleanTitle = this.normalizeName(folderName);
        }

        this.coreService.log(`📁 [${folderPath}] Tipo: ${mediaType}, Titolo: "${cleanTitle}"`);

        // 🆕 Controllo duplicato: stesso hash già visto in questa scansione
        const alreadySeen = duplicateTracker.get(hash);
        if (alreadySeen) {
          alreadySeen.push({ filePath, title: cleanTitle, quality });
          this.coreService.log(
            `⚠️ Duplicato rilevato: "${filename}" in ${folderPath} (primo esemplare: ${alreadySeen[0].filePath})`,
          );
          // Salta l'inserimento: manteniamo un solo record per hash, come da comportamento attuale
          continue;
        }
        duplicateTracker.set(hash, [{ filePath, title: cleanTitle, quality }]);

        const existingMedia = await this.prisma.media.findFirst({
          where: { hash },
          include: { versions: true },
        });

        if (existingMedia) {
          encounteredIds.add(existingMedia.id);

          if (existingMedia.available === false) {
            await this.prisma.media.update({
              where: { id: existingMedia.id },
              data: { available: true },
            });
            this.coreService.log(`♻️ Media ${existingMedia.title} ripristinato come disponibile`);
          }

          this.coreService.log(`🔄 Media esistente: ${existingMedia.title} (${existingMedia.id})`);

          const existingVersion = existingMedia.versions.find(
            (v) => v.quality === quality,
          );

          if (existingVersion) {
            if (existingVersion.lastModified !== stats.mtime) {
              await this.prisma.mediaVersion.update({
                where: { id: existingVersion.id },
                data: {
                  filePath,
                  size: stats.size,
                  lastModified: stats.mtime,
                },
              });

              if (!updatedTitles.includes(existingMedia.title)) {
                updatedTitles.push(existingMedia.title);
              }
              result.updated++;
              this.coreService.log(`🔄 Versione aggiornata per ${filename}`);
            } else {
              this.coreService.log(`⏭️ Versione già aggiornata per ${filename}`);
            }
          } else {
            await this.prisma.mediaVersion.create({
              data: {
                mediaId: existingMedia.id,
                quality,
                filePath,
                size: stats.size,
                lastModified: stats.mtime,
              },
            });
            if (!updatedTitles.includes(existingMedia.title)) {
              updatedTitles.push(existingMedia.title);
            }
            result.added++;
            this.coreService.log(`➕ Nuova versione aggiunta per ${filename} (${quality})`);
          }
        } else {
          this.coreService.log(`🆕 Nuovo media: ${cleanTitle}`);

          let seriesId: string | undefined;
          if (mediaType === 'EPISODE' && seriesTitle) {
            let series = await this.prisma.series.findFirst({
              where: { title: seriesTitle },
            });
            if (!series) {
              series = await this.prisma.series.create({
                data: {
                  title: seriesTitle,
                  metadataSource: 'default',
                },
              });
              this.coreService.log(`📺 Serie creata: ${seriesTitle}`);
            }
            seriesId = series.id;
          }

          const newMedia = await this.prisma.media.create({
            data: {
              hash,
              title: cleanTitle,
              type: mediaType as any,
              seriesId: seriesId || null,
              episodeNumber: episodeNumber || null,
              metadataSource: isPersonalRoot ? 'local' : 'default',
              folderPath: folderPath,
              available: true,
            },
          });

          encounteredIds.add(newMedia.id);

          if (mediaType === 'EPISODE' && seriesId && seasonNumber !== undefined) {
            let season = await this.prisma.season.findFirst({
              where: {
                seriesId,
                seasonNumber,
              },
            });
            if (!season) {
              season = await this.prisma.season.create({
                data: {
                  seriesId,
                  seasonNumber,
                },
              });
            }
            await this.prisma.media.update({
              where: { id: newMedia.id },
              data: { seasonId: season.id },
            });
          }

          await this.prisma.mediaVersion.create({
            data: {
              mediaId: newMedia.id,
              quality,
              filePath,
              size: stats.size,
              lastModified: stats.mtime,
            },
          });
          if (!addedTitles.includes(cleanTitle)) {
            addedTitles.push(cleanTitle);
          }
          result.added++;
          this.coreService.log(`✅ Nuovo media creato: ${cleanTitle} (ID: ${newMedia.id})`);

          try {
            this.coreService.log(`📡 Avvio aggiornamento metadati per "${cleanTitle}"...`);
            await this.metadataManager.updateMetadataForMedia(newMedia.id);
          } catch (metadataError) {
            this.coreService.error(`❌ Errore metadati per ${cleanTitle}`, metadataError.message);
            result.errors.push(`Errore metadati per ${cleanTitle}: ${metadataError.message}`);
          }
        }
      } catch (error) {
        result.errors.push(`❌ Errore su ${filename}: ${error.message}`);
        this.coreService.error(`❌ Errore scansione ${filename}`, error.stack);
      }
    }

    return result;
  }

  // ================================
  // METODI DI RICONOSCIMENTO
  // ================================

  private isVideoFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return this.VIDEO_EXTENSIONS.has(ext);
  }

  private extractQuality(filename: string): string {
    const lower = filename.toLowerCase();
    for (const [pattern, quality] of Object.entries(this.QUALITY_PATTERNS)) {
      if (lower.includes(pattern)) return quality;
    }
    return 'SD';
  }

  private parseSeriesInfo(filename: string): { season: number; episode: number } | null {
    for (const pattern of this.SEASON_EPISODE_PATTERNS) {
      const match = filename.match(pattern);
      if (match) {
        const season = parseInt(match[1]);
        const episode = parseInt(match[2]);
        if (!isNaN(season) && !isNaN(episode)) {
          return { season, episode };
        }
      }
    }
    return null;
  }

  private isSeriesFile(filename: string): boolean {
    return this.parseSeriesInfo(filename) !== null;
  }

  private determineMediaType(filename: string): 'MOVIE' | 'EPISODE' | 'PERSONAL' {
    if (this.isSeriesFile(filename)) return 'EPISODE';
    return 'MOVIE';
  }

  private normalizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().replace(/\s+/g, ' ');
  }

  private extractCleanTitle(filename: string): string {
    let title = path.basename(filename, path.extname(filename));
    title = title.replace(/\((\d{4})\)/, '');
    for (const pattern of Object.keys(this.QUALITY_PATTERNS)) {
      title = title.replace(new RegExp(pattern, 'gi'), '');
    }
    for (const pattern of this.SEASON_EPISODE_PATTERNS) {
      title = title.replace(pattern, '');
    }
    title = title.replace(/[_.-]/g, ' ').trim().replace(/\s+/g, ' ');
    title = title.replace(/[^a-zA-Z0-9\s]/g, '');
    return title || 'Untitled';
  }

  private async computeFileHash(filePath: string): Promise<string> {
    try {
      const fileHandle = await fs.open(filePath, 'r');
      try {
        const buffer = Buffer.alloc(1024 * 1024);
        const { bytesRead } = await fileHandle.read(buffer, 0, buffer.length, 0);
        const hash = crypto.createHash('sha256').update(buffer.slice(0, bytesRead)).digest('hex');
        return hash;
      } finally {
        await fileHandle.close();
      }
    } catch (error) {
      this.coreService.error(`❌ Errore calcolo hash per ${filePath}`, error.message);
      throw error;
    }
  }

  private extractSeriesTitleFromFilename(filename: string): string | null {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    for (const pattern of this.SEASON_EPISODE_PATTERNS) {
      const match = nameWithoutExt.match(pattern);
      if (match && match.index !== undefined && match.index > 0) {
        let seriesPart = nameWithoutExt.substring(0, match.index);
        seriesPart = seriesPart
          .replace(/[._\-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (seriesPart.length > 0) {
          return seriesPart;
        }
      }
    }
    return null;
  }
}