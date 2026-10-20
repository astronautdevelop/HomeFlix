import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { CoreService } from '../../core/core.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { StorageManagerService } from '../storage-manager/storage-manager.service';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';

@Injectable()
export class SettingsService implements OnModuleInit {
  private cachedSettings: {
    tmdbApiKey: string | null;
    mediaRoots: string[];
  } | null = null;

  constructor(
    private prisma: PrismaService,
    private coreService: CoreService,
    private storageManager: StorageManagerService,
    private notificationService: NotificationManagerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.loadSettingsFromDb();
  }

  private async loadSettingsFromDb(): Promise<void> {
    try {
      let setting = await this.prisma.setting.findUnique({
        where: { key: 'app_settings' },
      });

      if (!setting) {
        const envKey = this.coreService.getTmdbApiKeyFromEnv() ?? null;
        const envRoots = this.coreService.getMediaRootsFromEnv() ?? [];
        const value = {
          tmdbApiKey: envKey,
          mediaRoots: envRoots,
        };
        setting = await this.prisma.setting.create({
          data: {
            key: 'app_settings',
            value,
          },
        });
        this.coreService.log('Settings inizializzati dal .env');
      }

      this.cachedSettings = setting.value as any;

      if (this.cachedSettings) {
        // ----- TMDB API Key -----
        const dbKey = this.cachedSettings.tmdbApiKey;
        const envKey = this.coreService.getTmdbApiKeyFromEnv();
        const effectiveKey =
          dbKey && dbKey.trim() !== '' ? dbKey : envKey;

        this.coreService.setTmdbApiKey(effectiveKey ?? undefined);
        this.cachedSettings.tmdbApiKey = effectiveKey ?? null;

        if (!effectiveKey) {
          this.coreService.warn('🔑 TMDB Key: MISSING (né DB né .env)');
        } else if (dbKey && dbKey.trim() !== '') {
          this.coreService.log('🔑 TMDB Key source: DB (Settings)');
        } else {
          this.coreService.log('🔑 TMDB Key source: ENV (.env)');
        }

        // ----- Media Roots -----
        const dbRoots = this.cachedSettings.mediaRoots;
        const envRoots = this.coreService.getMediaRootsFromEnv();
        const effectiveRoots =
          Array.isArray(dbRoots) && dbRoots.length > 0 ? dbRoots : envRoots;

        this.coreService.setMediaRoots(effectiveRoots ?? []);
        this.cachedSettings.mediaRoots = effectiveRoots ?? [];
      }
    } catch (error) {
      this.coreService.error('Errore caricamento settings', error.stack);
      this.cachedSettings = {
        tmdbApiKey: this.coreService.getTmdbApiKeyFromEnv() ?? null,
        mediaRoots: this.coreService.getMediaRootsFromEnv() ?? [],
      };
    }
  }

  getSettings() {
    if (!this.cachedSettings) {
      this.loadSettingsFromDb();
    }
    return this.cachedSettings || { tmdbApiKey: null, mediaRoots: [] };
  }

  // ============================================================
  // 🔑 VALIDAZIONE CHIAVE TMDB
  // ============================================================

  async validateTmdbKey(key: string): Promise<{ valid: boolean; message: string }> {
    const trimmed = (key ?? '').trim();
    if (!trimmed) {
      return { valid: false, message: 'Chiave vuota' };
    }

    try {
      const res = await axios.get(
        'https://api.themoviedb.org/3/configuration',
        {
          params: { api_key: trimmed },
          timeout: 8000,
        },
      );

      if (res.status === 200) {
        return { valid: true, message: 'Chiave valida' };
      }
      return {
        valid: false,
        message: `Risposta inattesa da TMDB (${res.status})`,
      };
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        return { valid: false, message: 'Chiave non valida (401 Unauthorized)' };
      }
      if (status === 404) {
        return { valid: false, message: 'Endpoint TMDB non raggiungibile' };
      }
      const code = err?.code;
      if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
        return { valid: false, message: 'Timeout: TMDB non raggiungibile' };
      }
      if (code === 'ENOTFOUND' || code === 'ERR_NETWORK') {
        return { valid: false, message: 'Nessuna connessione a internet' };
      }
      return { valid: false, message: err?.message || 'Errore sconosciuto' };
    }
  }

  // ============================================================
  // 💾 AGGIORNAMENTO IMPOSTAZIONI
  // ============================================================

  async updateSettings(
    dto: UpdateSettingsDto,
  ): Promise<{ tmdbApiKey: string | null; mediaRoots: string[] }> {
    const current = this.getSettings();
    const previousRoots = current.mediaRoots || [];
    const previousEffectiveKey = current.tmdbApiKey ?? null;

    const newValue = {
      tmdbApiKey:
        dto.tmdbApiKey !== undefined ? dto.tmdbApiKey : current.tmdbApiKey,
      mediaRoots:
        dto.mediaRoots !== undefined ? dto.mediaRoots : current.mediaRoots,
    };

    await this.prisma.setting.upsert({
      where: { key: 'app_settings' },
      update: { value: newValue },
      create: { key: 'app_settings', value: newValue },
    });

    this.cachedSettings = newValue;

    // ----- TMDB API Key -----
    if (dto.tmdbApiKey !== undefined) {
      const dbKey = dto.tmdbApiKey;
      const envKey = this.coreService.getTmdbApiKeyFromEnv();
      const effectiveKey =
        dbKey && dbKey.trim() !== '' ? dbKey : envKey;

      this.coreService.setTmdbApiKey(effectiveKey ?? undefined);
      this.cachedSettings.tmdbApiKey = effectiveKey ?? null;

      if (effectiveKey) {
        this.coreService.resetMissingApiKeyNotification();
      }

      // 🔥 Se la chiave EFFETTIVA è cambiata → invalida la cache TMDB
      //    (altrimenti MetadataManagerService continuerebbe a servire
      //    risposte in-memory anche dopo la rimozione della chiave)
      if (previousEffectiveKey !== (effectiveKey ?? null)) {
        const source =
          dbKey && dbKey.trim() !== ''
            ? 'db'
            : effectiveKey
            ? 'env'
            : 'none';

        this.eventEmitter.emit('tmdb-key-changed', {
          hasKey: !!effectiveKey,
          source,
        });

        try {
          if (effectiveKey) {
            await this.notificationService.notify(
              'success',
              'Chiave API TMDB salvata e attivata',
              { action: 'tmdb_key_saved', source },
            );
          } else {
            await this.notificationService.notify(
              'warning',
              'Chiave API TMDB rimossa',
              { action: 'tmdb_key_removed', source },
            );
          }
        } catch (err) {
          this.coreService.error(
            'Errore invio notifica chiave TMDB',
            err?.stack,
          );
        }
      }
    }

    // ----- Media Roots -----
    if (dto.mediaRoots !== undefined) {
      this.coreService.setMediaRoots(dto.mediaRoots);
      await this.storageManager.refreshDevices();

      const removedRoots = previousRoots.filter(
        (root) => !dto.mediaRoots!.includes(root),
      );

      if (removedRoots.length > 0) {
        try {
          const label =
            removedRoots.length === 1
              ? `Disco rimosso: "${removedRoots[0]}"`
              : `${removedRoots.length} dischi rimossi`;
          await this.notificationService.notify('warning', label, {
            removedRoots,
            count: removedRoots.length,
          });
        } catch (err) {
          this.coreService.error(
            'Errore invio notifica rimozione disco',
            err?.stack,
          );
        }
      }
    }

    return newValue;
  }

  getTmdbApiKey(): string | null {
    return this.getSettings().tmdbApiKey;
  }

  getMediaRoots(): string[] {
    return this.getSettings().mediaRoots || [];
  }
}