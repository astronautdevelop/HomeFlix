import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import { CoreService } from '../../core/core.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActorCacheService implements OnModuleInit {
  private readonly logger = new Logger(ActorCacheService.name);
  private readonly CACHE_FOLDER = 'actors';
  private readonly IMAGE_SIZE = 'w185';

  constructor(
    private coreService: CoreService,
    private prisma: PrismaService, // 🔥 AGGIUNTO
  ) {}

  async onModuleInit() {
    const cachePath = this.getCachePath();
    await fs.mkdir(cachePath, { recursive: true });
  }

  // RENDE PUBBLICO PER IL CONTROLLER
  public getCachePath(): string {
    const basePath = this.coreService.getCachePath();
    return path.join(basePath, this.CACHE_FOLDER);
  }

  private getActorFileName(actorName: string): string {
    const safeName = actorName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    return `${safeName}.jpg`;
  }

  async getActorImage(actorName: string, tmdbProfilePath: string | null): Promise<string | null> {
    if (!tmdbProfilePath) {
      return null;
    }

    const cachePath = this.getCachePath();
    const fileName = this.getActorFileName(actorName);
    const localPath = path.join(cachePath, fileName);

    try {
      await fs.access(localPath);
      this.logger.log(`Immagine attore in cache: ${actorName}`);
      return localPath;
    } catch {
      // Non esiste, scarica
    }

    try {
      const url = `https://image.tmdb.org/t/p/${this.IMAGE_SIZE}${tmdbProfilePath}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.writeFile(localPath, Buffer.from(response.data as ArrayBuffer));
      this.logger.log(`Immagine attore scaricata: ${actorName}`);
      return localPath;
    } catch (error) {
      this.logger.error(`Errore download immagine attore ${actorName}`, error.stack);
      return null;
    }
  }

  async getActorImages(
    actors: { name: string; profilePath: string | null }[]
  ): Promise<{ name: string; imagePath: string | null }[]> {
    const results: { name: string; imagePath: string | null }[] = [];
    for (const actor of actors) {
      const imagePath = await this.getActorImage(actor.name, actor.profilePath);
      results.push({ name: actor.name, imagePath });
    }
    return results;
  }

  // ============================================================
  // 🔥 GARBAGE COLLECTION – RIMUOVE IMMAGINI ATTORE NON UTILIZZATE
  // ============================================================

  /**
   * 🔥 Garbage Collection: rimuove le immagini degli attori non più utilizzate
   * Controlla tutti i film nel database e mantiene solo le immagini
   * degli attori che appaiono in almeno un film.
   */
async runGarbageCollection(): Promise<{ deleted: number; errors: string[] }> {
    const result = { deleted: 0, errors: [] as string[] };

    try {
      // 1. Recupera attori da Media
      const allMedia = await this.prisma.media.findMany({
        select: { actors: true },
      });

      // 🔥 Recupera attori anche da Series
      const allSeries = await this.prisma.series.findMany({
        select: { actors: true },
      });

      const actorNamesSet = new Set<string>();

      const collect = (actors: any) => {
        if (actors && Array.isArray(actors)) {
          for (const actor of actors) {
            if (typeof actor === 'string' && actor.trim()) {
              actorNamesSet.add(this.normalizeActorName(actor));
            }
          }
        }
      };

      for (const media of allMedia) collect(media.actors);
      for (const series of allSeries) collect(series.actors);

      this.logger.log(
        `📊 Trovati ${actorNamesSet.size} attori unici in Media + Series`,
      );

      // 2. Scansiona la cartella cache
      const cachePath = this.getCachePath();
      try {
        await fs.access(cachePath);
      } catch {
        this.logger.log('📁 Cartella cache attori non trovata, nessuna pulizia necessaria');
        return result;
      }

      const files = await fs.readdir(cachePath);

      // 3. Per ogni file, controlla se l'attore è ancora presente
      for (const file of files) {
        if (file.startsWith('.') || !file.match(/\.(jpg|jpeg|png|webp)$/i)) {
          continue;
        }

        const actorNameFromFile = this.extractActorNameFromFile(file);
        const normalizedFileActor = this.normalizeActorName(actorNameFromFile);

        if (!actorNamesSet.has(normalizedFileActor)) {
          const filePath = path.join(cachePath, file);
          try {
            await fs.unlink(filePath);
            result.deleted++;
            this.logger.log(`🗑️ Eliminata immagine cache: ${file}`);
          } catch (err) {
            result.errors.push(`Errore eliminazione ${file}: ${err.message}`);
            this.logger.error(`Errore eliminazione ${file}`, err.stack);
          }
        }
      }

      this.logger.log(`✅ Garbage Collection completata: ${result.deleted} file eliminati`);
      return result;
    } catch (error) {
      this.logger.error('❌ Errore durante garbage collection', error.stack);
      result.errors.push(`Errore generale: ${error.message}`);
      return result;
    }
  }

  /**
   * Normalizza il nome di un attore per il confronto
   * Es. "Tom Hanks" → "tom_hanks"
   */
  private normalizeActorName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Estrae il nome dell'attore dal nome del file
   * Es. "tom_hanks.jpg" → "tom hanks"
   */
  private extractActorNameFromFile(filename: string): string {
    const baseName = path.basename(filename, path.extname(filename));
    // Sostituisci underscores con spazi per il confronto (verrà normalizzato dopo)
    return baseName.replace(/_/g, ' ');
  }
}