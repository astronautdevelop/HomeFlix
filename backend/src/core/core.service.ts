import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';   // 🔥 AGGIUNTO

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);

  private tmdbApiKeyCache: string | undefined;
  private mediaRootsCache: string[] | undefined;
  private hasNotifiedMissingApiKey = false;

  constructor(private configService: ConfigService) {
    this.tmdbApiKeyCache = this.configService.get<string>('TMDB_API_KEY');
    const roots = this.configService.get<string>('MEDIA_ROOTS');
    if (roots) {
      try {
        this.mediaRootsCache = JSON.parse(roots);
      } catch {
        this.mediaRootsCache = roots.split(',').map((p) => p.trim());
      }
    } else {
      this.mediaRootsCache = [];
    }
  }

  getTmdbApiKey(): string | undefined {
    return this.tmdbApiKeyCache;
  }

  getMediaRoots(): string[] {
    return this.mediaRootsCache || [];
  }

  getTmdbApiKeyFromEnv(): string | undefined {
    return this.configService.get<string>('TMDB_API_KEY');
  }

  getMediaRootsFromEnv(): string[] {
    const roots = this.configService.get<string>('MEDIA_ROOTS');
    if (!roots) return [];
    try {
      return JSON.parse(roots);
    } catch {
      return roots.split(',').map((p) => p.trim());
    }
  }

  setTmdbApiKey(key: string | undefined) {
    this.tmdbApiKeyCache = key;
  }

  setMediaRoots(roots: string[]) {
    this.mediaRootsCache = roots;
  }

  // ---------- METODI ESISTENTI ----------
  getCachePath(): string {
    return this.configService.get<string>('CACHE_PATH') || '.homeflix/cache';
  }

  // 🔥 NUOVI METODI — Cache centralizzata immagini media (path assoluti)
  getMediaPosterCachePath(): string {
    return path.resolve(this.getCachePath(), 'media', 'poster');
  }

  getMediaBackgroundCachePath(): string {
    return path.resolve(this.getCachePath(), 'media', 'background');
  }

  // ---------- LOGGING ROBUSTO ----------
  log(message: any, ...optionalParams: any[]) {
    const msg = message ?? '';
    if (optionalParams && optionalParams.length > 0) {
      const filtered = optionalParams.filter((p) => p !== undefined);
      if (filtered.length > 0) {
        this.logger.log(msg, ...filtered);
      } else {
        this.logger.log(msg);
      }
    } else {
      this.logger.log(msg);
    }
  }

  error(message: any, trace?: string, ...optionalParams: any[]) {
    const msg = message ?? '';
    if (trace) {
      const extra = optionalParams.filter((p) => p !== undefined);
      if (extra.length > 0) {
        this.logger.error(msg, trace, ...extra);
      } else {
        this.logger.error(msg, trace);
      }
    } else {
      const extra = optionalParams.filter((p) => p !== undefined);
      if (extra.length > 0) {
        this.logger.error(msg, ...extra);
      } else {
        this.logger.error(msg);
      }
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    const msg = message ?? '';
    if (optionalParams && optionalParams.length > 0) {
      const filtered = optionalParams.filter((p) => p !== undefined);
      if (filtered.length > 0) {
        this.logger.warn(msg, ...filtered);
      } else {
        this.logger.warn(msg);
      }
    } else {
      this.logger.warn(msg);
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    const msg = message ?? '';
    if (optionalParams && optionalParams.length > 0) {
      const filtered = optionalParams.filter((p) => p !== undefined);
      if (filtered.length > 0) {
        this.logger.debug(msg, ...filtered);
      } else {
        this.logger.debug(msg);
      }
    } else {
      this.logger.debug(msg);
    }
  }

    // ---------- WARNING API MANCANTE (dedup) ----------
  hasNotifiedMissingApiKeyAlready(): boolean {
    return this.hasNotifiedMissingApiKey;
  }

  markMissingApiKeyNotified(): void {
    this.hasNotifiedMissingApiKey = true;
  }

  resetMissingApiKeyNotification(): void {
    this.hasNotifiedMissingApiKey = false;
  }
}