import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import { CoreService } from '../../core/core.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ActorCacheService } from '../metadata-manager/actor-cache.service';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';

// ===== INTERFACCE TMDB PER LE PERSONE =====
interface TmdbPersonSearchResponse {
  results: {
    id: number;
    name: string;
    profile_path: string | null;
    known_for?: any[];
  }[];
}

interface TmdbPersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  also_known_as: string[];
  profile_path: string | null;
  images?: {
    profiles?: { file_path: string }[];
  };
}

export interface ActorDetails {
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  alsoKnownAs: string[];
  profilePath: string | null;
  countryCode: string | null;
}

@Injectable()
export class ActorService {
  private readonly logger = new Logger(ActorService.name);
  private readonly TMDB_BASE = 'https://api.themoviedb.org/3';
  private readonly CACHE_METADATA_FOLDER = 'metadata/actors';

  constructor(
    private prisma: PrismaService,
    private coreService: CoreService,
    private actorCache: ActorCacheService,
    private notificationService: NotificationManagerService,
  ) {}

  private getCacheBase(): string {
    return this.coreService.getCachePath();
  }

  private getMetadataCachePath(): string {
    return path.join(this.getCacheBase(), this.CACHE_METADATA_FOLDER);
  }

  private getActorMetadataFileName(actorName: string): string {
    const safe = this.normalizeName(actorName);
    return `${safe}.json`;
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * 🟡 Invia il warning "API mancante" una sola volta per sessione.
   *    Usa il flag condiviso su CoreService per evitare spam di notifiche.
   */
  private async notifyMissingApiKeyOnce(): Promise<void> {
    if (this.coreService.hasNotifiedMissingApiKeyAlready()) return;
    this.coreService.markMissingApiKeyNotified();
    try {
      await this.notificationService.notify(
        'warning',
        'TMDB API Key non configurata',
        { reason: 'missing_api_key' },
      );
    } catch (err) {
      this.logger.error('Errore invio notifica API mancante', err?.stack);
    }
  }

  // ---------- Recupero dettagli attore (con cache) ----------
  async getActorDetails(actorName: string): Promise<ActorDetails | null> {
    const cachePath = this.getMetadataCachePath();
    const fileName = this.getActorMetadataFileName(actorName);
    const filePath = path.join(cachePath, fileName);

    // 1. Prova a leggere da cache
    try {
      await fs.access(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as ActorDetails;
    } catch {
      // Non esiste, procedi con TMDB
    }

    // 2. Legge la chiave dal CoreService (unica fonte centralizzata)
    const apiKey = this.coreService.getTmdbApiKey();
    if (!apiKey) {
      this.logger.warn('TMDB API Key non configurata');
      await this.notifyMissingApiKeyOnce();
      return null;
    }

    try {
      // Cerca persona
      const searchUrl = `${this.TMDB_BASE}/search/person`;
      const searchRes = await axios.get<TmdbPersonSearchResponse>(searchUrl, {
        params: {
          api_key: apiKey,
          query: actorName,
          language: 'it-IT',
        },
      });

      if (!searchRes.data.results || searchRes.data.results.length === 0) {
        this.logger.warn(`Attore non trovato su TMDB: ${actorName}`);
        return null;
      }

      const personId = searchRes.data.results[0].id;

      // Dettaglio persona in italiano
      const detailUrl = `${this.TMDB_BASE}/person/${personId}`;
      const detailRes = await axios.get<TmdbPersonDetails>(detailUrl, {
        params: {
          api_key: apiKey,
          language: 'it-IT',
          append_to_response: 'images',
        },
      });

      const data = detailRes.data;
      let biography = data.biography || '';

      // 🔥 Se la biografia in italiano è vuota, fallback in inglese
      if (!biography) {
        try {
          this.logger.log(
            `🔍 Biografia non trovata in italiano per ${actorName}, recupero in inglese...`,
          );
          const englishDetailRes = await axios.get<TmdbPersonDetails>(detailUrl, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              append_to_response: 'images',
            },
          });
          biography = englishDetailRes.data.biography || '';
          if (biography) {
            this.logger.log(`✅ Biografia recuperata in inglese per ${actorName}`);
          } else {
            this.logger.warn(
              `⚠️ Nessuna biografia disponibile (né italiano né inglese) per ${actorName}`,
            );
          }
        } catch (error) {
          this.logger.warn(
            `Impossibile recuperare biografia in inglese per ${actorName}: ${error.message}`,
          );
        }
      }

      let countryCode: string | null = null;
      if (data.place_of_birth) {
        const country = this.extractCountryFromPlace(data.place_of_birth);
        if (country) {
          countryCode = this.mapCountryToCode(country);
        }
      }

      const details: ActorDetails = {
        name: data.name || actorName,
        biography: biography,
        birthday: data.birthday || null,
        deathday: data.deathday || null,
        placeOfBirth: data.place_of_birth || null,
        alsoKnownAs: data.also_known_as || [],
        profilePath: data.profile_path || null,
        countryCode,
      };

      // 3. Salva in cache
      await fs.mkdir(cachePath, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(details, null, 2), 'utf-8');

      // 4. Scarica anche l'immagine se non esiste
      if (data.profile_path) {
        await this.actorCache.getActorImage(actorName, data.profile_path);
      }

      return details;
    } catch (error) {
      this.logger.error(`Errore recupero attore ${actorName}`, error.stack);
      return null;
    }
  }

  // ---------- Filmografia (film + stagioni serie TV) ----------
  async getMoviesForActor(actorName: string): Promise<any[]> {
    try {
      const actorJson = JSON.stringify([actorName]);

      // 1. FILM in cui appare l'attore
      const movies = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, "posterUrl", "backgroundUrl", "releaseYear", rating, type
        FROM "Media"
        WHERE "actors" @> ${actorJson}::jsonb
          AND type = 'MOVIE'
        ORDER BY "releaseYear" DESC NULLS LAST
      `;

      // 2. STAGIONI delle serie dove appare l'attore
      //    (almeno un episodio della stagione ha l'attore in Media.actors)
      const seasonRows = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT DISTINCT s.id
        FROM "Season" s
        INNER JOIN "Media" m ON m."seasonId" = s.id
        WHERE m."actors" @> ${actorJson}::jsonb
          AND m.type = 'EPISODE'
      `;

      const seasonIds = seasonRows.map((s) => s.id);

      let seasonsAggregated: any[] = [];
      if (seasonIds.length > 0) {
        const seasonData = await this.prisma.season.findMany({
          where: { id: { in: seasonIds } },
          include: {
            series: true,
            episodes: {
              select: { id: true, available: true, runtime: true },
            },
          },
          orderBy: [
            { series: { title: 'asc' } },
            { seasonNumber: 'asc' },
          ],
        });

        seasonsAggregated = seasonData.map((s) => ({
          id: s.id,
          type: 'SEASON',
          seriesId: s.seriesId,
          seriesTitle: s.series.title,
          title: s.series.title,
          posterUrl: s.series.posterUrl,
          backgroundUrl: s.series.backgroundUrl,
          releaseYear: s.series.releaseYear,
          rating: s.series.rating,
          genres: s.series.genres,
          seasonNumber: s.seasonNumber,
          seasonTitle: s.title,
          episodesCount: s.episodes.length,
          episodesAvailable: s.episodes.filter((e) => e.available).length,
        }));
      }

      return [...movies, ...seasonsAggregated];
    } catch (error) {
      this.logger.error(
        `Errore recupero film per attore ${actorName}`,
        error.stack,
      );
      return [];
    }
  }
  
  // ---------- Garbage Collection estesa ----------
  async runGarbageCollection(): Promise<{
    deletedImages: number;
    deletedMetadata: number;
    errors: string[];
  }> {
    const result = {
      deletedImages: 0,
      deletedMetadata: 0,
      errors: [] as string[],
    };

    // 1. Raccolta nomi attori ancora in uso
    const allMedia = await this.prisma.media.findMany({
      select: { actors: true },
    });
    const activeNames = new Set<string>();
    for (const media of allMedia) {
      if (media.actors && Array.isArray(media.actors)) {
        for (const actor of media.actors) {
          if (typeof actor === 'string') {
            activeNames.add(this.normalizeName(actor));
          }
        }
      }
    }

    this.logger.log(`📊 Attori unici attivi: ${activeNames.size}`);

    // 2. Pulizia immagini (usando il servizio esistente)
    const imageResult = await this.actorCache.runGarbageCollection();
    result.deletedImages = imageResult.deleted;
    result.errors.push(...imageResult.errors);

    // 3. Pulizia metadati (file JSON)
    const metadataPath = this.getMetadataCachePath();
    try {
      await fs.access(metadataPath);
      const files = await fs.readdir(metadataPath);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const baseName = path.basename(file, '.json');
        if (!activeNames.has(baseName)) {
          const filePath = path.join(metadataPath, file);
          try {
            await fs.unlink(filePath);
            result.deletedMetadata++;
            this.logger.log(`🗑️ Eliminato metadato attore: ${file}`);
          } catch (err) {
            result.errors.push(`Errore eliminazione ${file}: ${err.message}`);
          }
        }
      }
    } catch {
      // Cartella non esiste
    }

    this.logger.log(
      `✅ Garbage Collection completata: ${result.deletedImages} immagini, ${result.deletedMetadata} metadati eliminati`,
    );
    return result;
  }

  // ---------- Utility: paese da luogo di nascita ----------
  private extractCountryFromPlace(place: string): string | null {
    const parts = place.split(',').map((p) => p.trim());
    if (parts.length === 0) return null;
    return parts[parts.length - 1];
  }

  private mapCountryToCode(countryName: string): string | null {
    const map: Record<string, string> = {
      USA: 'us',
      'United States': 'us',
      'United States of America': 'us',
      Italia: 'it',
      Italy: 'it',
      Ukraine: 'ukr',
      Ucraina: 'ukr',
      UK: 'gb',
      England: 'gb',
      'Regno Unito': 'gb',
      'United Kingdom': 'gb',
      Francia: 'fr',
      France: 'fr',
      Germania: 'de',
      Germany: 'de',
      Spagna: 'es',
      Spain: 'es',
      Sweden: 'swe',
      Svedese: 'swe',
      Swedish: 'swe',
      Svezia: 'swe',
      Canada: 'ca',
      Australia: 'au',
      Giappone: 'jp',
      Japan: 'jp',
      Cina: 'cn',
      China: 'cn',
      India: 'in',
      Brasile: 'br',
      Brazil: 'br',
      Messico: 'mx',
      Mexico: 'mx',
      'Corea del Sud': 'kr',
      'South Korea': 'kr',
      Russia: 'ru',
      Sudafrica: 'za',
      'South Africa': 'za',
    };
    const lower = countryName.toLowerCase();
    for (const [key, code] of Object.entries(map)) {
      if (lower.includes(key.toLowerCase())) {
        return code;
      }
    }
    return null;
  }
}