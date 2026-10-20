import { OnEvent } from '@nestjs/event-emitter';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateMediaMetadataDto } from './dto/update-media-metadata.dto';
import { UpdateSeriesMetadataDto } from './dto/update-series-metadata.dto';
import { UpdateEpisodeMetadataDto } from './dto/update-episode-metadata.dto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CoreService } from '../../core/core.service';
import { StorageManagerService } from '../storage-manager/storage-manager.service';
import { ActorCacheService } from './actor-cache.service';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  TmdbMovieDetails,
  TmdbSeriesDetails,
  TmdbEpisodeDetails,
  TmdbMovieSearchResponse,
  TmdbSeriesSearchResponse,
} from './interfaces/tmdb.interface';
import { MetadataDto, UpdateMetadataResponse } from './dto/metadata.dto';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';

@Injectable()
export class MetadataManagerService implements OnModuleInit {
  private readonly logger = new Logger(MetadataManagerService.name);
  private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  private readonly TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
  private readonly POSTER_SIZE = 'w500';
  private readonly BACKDROP_SIZE = 'w780';
  private readonly LOGO_SIZE = 'w300';

  private tmdbCache = new Map<string, any>();

  /**
   * 🔄 Invalida la cache TMDB in memoria quando la chiave API cambia o
   *    viene rimossa. Senza questo, dopo la rimozione della chiave il
   *    servizio continuerebbe a restituire risposte TMDB già memorizzate,
   *    anche per titoli identici scansionati in momenti diversi.
   */
  @OnEvent('tmdb-key-changed')
  handleTmdbKeyChanged(payload: { hasKey: boolean; source: string }) {
    const size = this.tmdbCache.size;
    this.tmdbCache.clear();
    this.logger.log(
      `🔄 Cache TMDB invalidata (${size} voci rimosse, chiave ${
        payload.hasKey ? 'aggiornata' : 'rimossa'
      }, fonte: ${payload.source})`,
    );
  }

  private readonly IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];

  constructor(
    private prisma: PrismaService,
    private coreService: CoreService,
    private storageManager: StorageManagerService,
    private actorCache: ActorCacheService,
    private notificationService: NotificationManagerService,
  ) {}

  async onModuleInit() {
    await this.actorCache.onModuleInit();

    const cachePath = this.coreService.getCachePath();
    try {
      await fs.mkdir(cachePath, { recursive: true });
      await fs.mkdir(path.join(cachePath, 'images'), { recursive: true });
      await fs.mkdir(path.join(cachePath, 'metadata'), { recursive: true });
      await fs.mkdir(this.coreService.getMediaPosterCachePath(), { recursive: true });
      await fs.mkdir(this.coreService.getMediaBackgroundCachePath(), { recursive: true });
    } catch (error) {
      this.logger.error('Impossibile creare la cartella cache', error.stack);
    }
  }

  // ============================
  // METODI PRINCIPALI
  // ============================

  async updateMetadataForMedia(mediaId: string): Promise<UpdateMetadataResponse> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { id: mediaId },
        include: { versions: true, series: true, season: true },
      });

      if (!media) {
        return {
          success: false,
          message: 'Media non trovato',
          mediaId,
          metadataSource: 'none',
        };
      }

      const folderPath = this.getMediaFolderPath(media);
      if (!folderPath) {
        return {
          success: false,
          message: 'Impossibile determinare il percorso della cartella',
          mediaId,
          metadataSource: 'none',
        };
      }

      const isEpisode = media.type === 'EPISODE';
      const localMetadata = isEpisode ? null : await this.readLocalMetadata(folderPath);

      let metadata: MetadataDto | null = null;
      let source = 'default';

      if (isEpisode) {
        // ===== SERIE TV =====
        if (media.seriesId) {
          const series = await this.prisma.series.findUnique({
            where: { id: media.seriesId },
          });
          if (series) {
            const tmdbSeries = await this.fetchSeriesFromTMDB(series.title);
            if (tmdbSeries && media.seasonId && media.episodeNumber) {
              const season = await this.prisma.season.findUnique({
                where: { id: media.seasonId },
              });
              if (season) {
                const episodeData = await this.fetchEpisodeFromTMDB(
                  tmdbSeries.id,
                  season.seasonNumber,
                  media.episodeNumber,
                );
                if (episodeData) {
                  metadata = this.mapTmdbEpisodeToMetadata(episodeData, tmdbSeries.name);
                  source = 'tmdb';

                  if (series.metadataSource !== 'local') {
                    await this.prisma.series.update({
                      where: { id: series.id },
                      data: { metadataSource: 'tmdb' },
                    });
                  }

                  await this.downloadAndCacheSeriesImages(tmdbSeries.id, series.id);

                  const seriesCast = tmdbSeries.credits?.cast?.slice(0, 10) || [];
                  if (seriesCast.length > 0) {
                    const actorData = seriesCast.map((c) => ({
                      name: c.name,
                      profilePath: c.profile_path || null,
                    }));
                    const actorsWithImages = await this.actorCache.getActorImages(actorData);
                    const actorNames = actorsWithImages.map((a) => a.name);
                    metadata.actors = actorNames;

                    await this.prisma.series.update({
                      where: { id: series.id },
                      data: { actors: actorNames },
                    });
                  }

                  const seriesPosterPath = path.join(
                    this.coreService.getMediaPosterCachePath(),
                    `series_${series.id}.jpg`,
                  );
                  const seriesBackgroundPath = path.join(
                    this.coreService.getMediaBackgroundCachePath(),
                    `series_${series.id}.jpg`,
                  );

                  if (await this.fileExists(seriesPosterPath)) {
                    metadata.posterUrl = seriesPosterPath;
                  }

                  if (episodeData.still_path) {
                    const bgPath = await this.downloadBackground(
                      mediaId,
                      episodeData.still_path,
                    );
                    if (bgPath) metadata.backgroundUrl = bgPath;
                  } else if (await this.fileExists(seriesBackgroundPath)) {
                    metadata.backgroundUrl = seriesBackgroundPath;
                  }
                }
              }
            }

            // 🔥 FALLBACK — assicura che la serie abbia SEMPRE poster/background validi
            //    (funziona anche se TMDB è irraggiungibile o non ha immagini)
            await this.ensureSeriesImages(series.id);
          }
        }

      } else if (localMetadata) {
        metadata = localMetadata;
        source = 'local';
        this.logger.log(`📁 Metadati locali trovati per ${media.title}`);
      } else if (media.type === 'MOVIE') {
        const tmdbData = await this.fetchMovieFromTMDB(
          media.title,
          media.releaseYear ?? undefined,
        );
        if (tmdbData) {
          metadata = await this.mapTmdbMovieToMetadata(tmdbData, folderPath, mediaId);
          source = 'tmdb';
          await this.saveMetadataJson(folderPath, metadata);
          this.logger.log(`📡 Metadati TMDB scaricati per ${media.title}`);
        }
      }

      if (!metadata) {
        metadata = this.createDefaultMetadata(media.title);
        source = 'default';
        if (!isEpisode) {
          await this.saveMetadataJson(folderPath, metadata);
        }
        this.logger.log(`📄 Metadati di default creati per ${media.title}`);
      }

      await this.updateMediaInDb(mediaId, metadata, source, media.title);
      await this.updateMediaImages(mediaId, folderPath, source);

      return {
        success: true,
        message: `Metadati aggiornati da ${source}`,
        mediaId,
        metadataSource: source,
      };
    } catch (error) {
      this.logger.error(`❌ Errore aggiornamento metadati per ${mediaId}`, error.stack);
      return {
        success: false,
        message: error.message,
        mediaId,
        metadataSource: 'error',
      };
    }
  }

  async updateAllMetadata(): Promise<{ total: number; success: number; failed: number }> {
    const mediaList = await this.prisma.media.findMany();
    let success = 0;
    let failed = 0;

    for (const media of mediaList) {
      const result = await this.updateMetadataForMedia(media.id);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
      await this.delay(200);
    }

    return { total: mediaList.length, success, failed };
  }

  // ============================
  // METODI DI SUPPORTO - PERCORSO
  // ============================

  private getMediaFolderPath(media: any): string | null {
    if (media.folderPath) {
      return media.folderPath;
    }
    if (media.versions && media.versions.length > 0) {
      return path.dirname(media.versions[0].filePath);
    }
    return null;
  }

  // ============================
  // METODI DI SUPPORTO - METADATA JSON
  // ============================

  private async readLocalMetadata(folderPath: string): Promise<MetadataDto | null> {
    const metadataPath = path.join(folderPath, 'metadata.json');
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed as MetadataDto;
    } catch {
      return null;
    }
  }

  private async saveMetadataJson(folderPath: string, metadata: MetadataDto): Promise<void> {
    const metadataPath = path.join(folderPath, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  }

  // ============================
  // TMDB FETCH
  // ============================

  private async fetchMovieFromTMDB(title: string, year?: number): Promise<TmdbMovieDetails | null> {
    const cacheKey = `movie_${title}_${year || 'any'}`;
    if (this.tmdbCache.has(cacheKey)) {
      return this.tmdbCache.get(cacheKey);
    }

    try {
      const apiKey = this.coreService.getTmdbApiKey();
      if (!apiKey) {
        this.logger.warn('TMDB API Key non configurata');
        await this.notifyMissingApiKeyOnce();
        return null;
      }

      const searchUrl = `${this.TMDB_BASE_URL}/search/movie`;
      const searchParams = {
        api_key: apiKey,
        query: title,
        year: year || undefined,
        language: 'it-IT',
        include_adult: false,
      };

      const searchResponse = await axios.get<TmdbMovieSearchResponse>(searchUrl, {
        params: searchParams,
      });

      if (searchResponse.data.results.length === 0) {
        return null;
      }

      const movieId = searchResponse.data.results[0].id;

      const detailsUrl = `${this.TMDB_BASE_URL}/movie/${movieId}`;
      const detailsParams = {
        api_key: apiKey,
        language: 'it-IT',
        append_to_response: 'credits,videos,images',
      };

      const detailsResponse = await axios.get<TmdbMovieDetails>(detailsUrl, {
        params: detailsParams,
      });

      this.tmdbCache.set(cacheKey, detailsResponse.data);
      return detailsResponse.data;
    } catch (error) {
      this.logger.error(`Errore TMDB per film ${title}`, error.stack);
      return null;
    }
  }

  private async fetchSeriesFromTMDB(title: string): Promise<TmdbSeriesDetails | null> {
    const cacheKey = `series_${title}`;
    if (this.tmdbCache.has(cacheKey)) {
      return this.tmdbCache.get(cacheKey);
    }

    try {
      const apiKey = this.coreService.getTmdbApiKey();
      if (!apiKey) {
        this.logger.warn('TMDB API Key non configurata');
        await this.notifyMissingApiKeyOnce();
        return null;
      }

      const searchUrl = `${this.TMDB_BASE_URL}/search/tv`;
      const searchParams = {
        api_key: apiKey,
        query: title,
        language: 'it-IT',
        include_adult: false,
      };

      const searchResponse = await axios.get<TmdbSeriesSearchResponse>(searchUrl, {
        params: searchParams,
      });

      if (searchResponse.data.results.length === 0) {
        return null;
      }

      const seriesId = searchResponse.data.results[0].id;

      const detailsUrl = `${this.TMDB_BASE_URL}/tv/${seriesId}`;
      const detailsParams = {
        api_key: apiKey,
        language: 'it-IT',
        append_to_response: 'credits,videos,images',
      };

      const detailsResponse = await axios.get<TmdbSeriesDetails>(detailsUrl, {
        params: detailsParams,
      });

      this.tmdbCache.set(cacheKey, detailsResponse.data);
      return detailsResponse.data;
    } catch (error) {
      this.logger.error(`Errore TMDB per serie ${title}`, error.stack);
      return null;
    }
  }

  private async fetchEpisodeFromTMDB(
    seriesId: number,
    seasonNumber: number,
    episodeNumber: number,
  ): Promise<TmdbEpisodeDetails | null> {
    const cacheKey = `episode_${seriesId}_${seasonNumber}_${episodeNumber}`;
    if (this.tmdbCache.has(cacheKey)) {
      return this.tmdbCache.get(cacheKey);
    }

    try {
      const apiKey = this.coreService.getTmdbApiKey();
      if (!apiKey) {
        this.logger.warn('TMDB API Key non configurata');
        await this.notifyMissingApiKeyOnce();
        return null;
      }

      const url = `${this.TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
      const params = {
        api_key: apiKey,
        language: 'it-IT',
        append_to_response: 'images',
      };

      const response = await axios.get<TmdbEpisodeDetails>(url, { params });

      this.tmdbCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Errore TMDB per episodio S${seasonNumber}E${episodeNumber}`,
        error.stack,
      );
      return null;
    }
  }

  private async fetchSeriesFromTMDBByid(seriesId: number): Promise<TmdbSeriesDetails | null> {
    const cacheKey = `series_id_${seriesId}`;
    if (this.tmdbCache.has(cacheKey)) {
      return this.tmdbCache.get(cacheKey);
    }

    try {
      const apiKey = this.coreService.getTmdbApiKey();
      if (!apiKey) {
        this.logger.warn('TMDB API Key non configurata');
        await this.notifyMissingApiKeyOnce();
        return null;
      }

      const url = `${this.TMDB_BASE_URL}/tv/${seriesId}`;
      const params = {
        api_key: apiKey,
        language: 'it-IT',
        append_to_response: 'credits,videos,images',
      };

      const response = await axios.get<TmdbSeriesDetails>(url, { params });
      this.tmdbCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      this.logger.error(`Errore TMDB per serie ID ${seriesId}`, error.stack);
      return null;
    }
  }

  // ============================
  // DOWNLOAD IMMAGINI - CACHE CENTRALIZZATA
  // ============================

  private async downloadImageToCache(
    url: string,
    cachePath: string,
    filename: string,
  ): Promise<string | null> {
    try {
      await fs.mkdir(cachePath, { recursive: true });
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const filePath = path.join(cachePath, filename);
      await fs.writeFile(filePath, Buffer.from(response.data as ArrayBuffer));
      this.logger.log(`✅ Immagine cache salvata: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`❌ Errore download immagine ${url}`, error.stack);
      return null;
    }
  }

  private async downloadPoster(mediaId: string, tmdbPath: string | null): Promise<string | null> {
    if (!tmdbPath) return null;
    const url = `${this.TMDB_IMAGE_BASE_URL}/${this.POSTER_SIZE}${tmdbPath}`;
    return this.downloadImageToCache(
      url,
      this.coreService.getMediaPosterCachePath(),
      `${mediaId}.jpg`,
    );
  }

  private async downloadBackground(mediaId: string, tmdbPath: string | null): Promise<string | null> {
    if (!tmdbPath) return null;
    const url = `${this.TMDB_IMAGE_BASE_URL}/${this.BACKDROP_SIZE}${tmdbPath}`;
    return this.downloadImageToCache(
      url,
      this.coreService.getMediaBackgroundCachePath(),
      `${mediaId}.jpg`,
    );
  }

  private getCachedPosterPath(mediaId: string): string {
    return path.join(this.coreService.getMediaPosterCachePath(), `${mediaId}.jpg`);
  }

  private getCachedBackgroundPath(mediaId: string): string {
    return path.join(this.coreService.getMediaBackgroundCachePath(), `${mediaId}.jpg`);
  }

  private async downloadAndCacheSeriesImages(
    seriesId: number,
    seriesDbId: string,
  ): Promise<void> {
    try {
      const posterPath = path.join(
        this.coreService.getMediaPosterCachePath(),
        `series_${seriesDbId}.jpg`,
      );
      const backgroundPath = path.join(
        this.coreService.getMediaBackgroundCachePath(),
        `series_${seriesDbId}.jpg`,
      );

      const posterExists = await this.fileExists(posterPath);
      const backgroundExists = await this.fileExists(backgroundPath);

      if (posterExists && backgroundExists) {
        await this.prisma.series.update({
          where: { id: seriesDbId },
          data: {
            posterUrl: posterPath,
            backgroundUrl: backgroundPath,
          },
        });
        return;
      }

      const details = await this.fetchSeriesFromTMDBByid(seriesId);
      if (!details) return;

      let newPosterPath: string | null = posterExists ? posterPath : null;
      let newBackgroundPath: string | null = backgroundExists ? backgroundPath : null;

      if (!posterExists && details.poster_path) {
        const url = `${this.TMDB_IMAGE_BASE_URL}/${this.POSTER_SIZE}${details.poster_path}`;
        newPosterPath = await this.downloadImageToCache(
          url,
          this.coreService.getMediaPosterCachePath(),
          `series_${seriesDbId}.jpg`,
        );
      }

      if (!backgroundExists && details.backdrop_path) {
        const url = `${this.TMDB_IMAGE_BASE_URL}/${this.BACKDROP_SIZE}${details.backdrop_path}`;
        newBackgroundPath = await this.downloadImageToCache(
          url,
          this.coreService.getMediaBackgroundCachePath(),
          `series_${seriesDbId}.jpg`,
        );
      }

      await this.prisma.series.update({
        where: { id: seriesDbId },
        data: {
          posterUrl: newPosterPath || undefined,
          backgroundUrl: newBackgroundPath || undefined,
        },
      });

      this.logger.log(`✅ Immagini serie in cache per series ${seriesDbId}`);
    } catch (error) {
      this.logger.error('Errore download immagini serie', error.stack);
    }
  }

  /**
   * 🖼️ Assicura che la serie abbia sempre poster/background validi nel DB.
   *    Se i path attuali sono nulli o i file non esistono più su disco,
   *    imposta i path delle immagini di default (stessi usati per i film).
   */
  private async ensureSeriesImages(seriesId: string): Promise<void> {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { posterUrl: true, backgroundUrl: true },
    });

    if (!series) return;

    const updateData: { posterUrl?: string; backgroundUrl?: string } = {};

    // --- POSTER ---
    const posterValid =
      !!series.posterUrl &&
      series.posterUrl.trim() !== '' &&
      (await this.fileExists(series.posterUrl));

    if (!posterValid) {
      const defaultPoster = await this.findDefaultImage('poster');
      if (defaultPoster) {
        updateData.posterUrl = defaultPoster;
        this.logger.log(
          `🖼️ Poster default applicato alla serie ${seriesId}: ${defaultPoster}`,
        );
      }
    }

    // --- BACKGROUND ---
    const backgroundValid =
      !!series.backgroundUrl &&
      series.backgroundUrl.trim() !== '' &&
      (await this.fileExists(series.backgroundUrl));

    if (!backgroundValid) {
      const defaultBackground = await this.findDefaultImage('background');
      if (defaultBackground) {
        updateData.backgroundUrl = defaultBackground;
        this.logger.log(
          `🖼️ Background default applicato alla serie ${seriesId}: ${defaultBackground}`,
        );
      }
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.series.update({
        where: { id: seriesId },
        data: updateData,
      });
      this.logger.log(
        `💾 Immagini serie salvate nel DB per series ${seriesId}`,
      );
    }
  }

  // ============================
  // MAP DATI TMDB
  // ============================

  private async mapTmdbMovieToMetadata(
    tmdbData: TmdbMovieDetails,
    folderPath: string,
    mediaId: string,
  ): Promise<MetadataDto> {
    const genres = tmdbData.genres?.map((g) => g.name) || [];

    const cast = tmdbData.credits?.cast?.slice(0, 10) || [];
    const actorData = cast.map((c) => ({
      name: c.name,
      profilePath: c.profile_path || null,
    }));

    const actorsWithImages = await this.actorCache.getActorImages(actorData);
    const actorNames = actorsWithImages.map((a) => a.name);

    const director = tmdbData.credits?.crew?.find((c) => c.job === 'Director')?.name;
    const country = tmdbData.production_countries?.[0]?.iso_3166_1 || '';
    const language = tmdbData.spoken_languages?.[0]?.iso_639_1 || '';
    const trailer = tmdbData.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube',
    )?.key;
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer}` : undefined;

    const posterPath = await this.downloadPoster(mediaId, tmdbData.poster_path);
    const backgroundPath = await this.downloadBackground(mediaId, tmdbData.backdrop_path);

    return {
      title: tmdbData.title || 'Titolo sconosciuto',
      originalTitle: tmdbData.original_title,
      plot: tmdbData.overview,
      runtime: tmdbData.runtime,
      releaseYear: tmdbData.release_date
        ? parseInt(tmdbData.release_date.substring(0, 4))
        : undefined,
      genres,
      actors: actorNames,
      director,
      country,
      language,
      revenue: tmdbData.revenue,
      oscarAwards: 0,
      rating: tmdbData.vote_average,
      trailerUrl,
      posterUrl: posterPath || undefined,
      backgroundUrl: backgroundPath || undefined,
      logoUrl: undefined,
      metadataSource: 'tmdb',
    };
  }

  private mapTmdbEpisodeToMetadata(
    episodeData: TmdbEpisodeDetails,
    seriesTitle: string,
  ): MetadataDto {
    return {
      title: `${seriesTitle} - S${episodeData.season_number}E${episodeData.episode_number}: ${episodeData.name}`,
      originalTitle: episodeData.name,
      plot: episodeData.overview,
      runtime: episodeData.runtime,
      releaseYear: episodeData.air_date
        ? parseInt(episodeData.air_date.substring(0, 4))
        : undefined,
      genres: [],
      actors: [],
      director: undefined,
      country: undefined,
      language: undefined,
      revenue: undefined,
      oscarAwards: 0,
      rating: episodeData.vote_average,
      trailerUrl: undefined,
      posterUrl: undefined,
      backgroundUrl: undefined,
      logoUrl: undefined,
      metadataSource: 'tmdb',
    };
  }

  // ============================
  // METADATI DEFAULT
  // ============================

  private createDefaultMetadata(title: string): MetadataDto {
    return {
      title,
      originalTitle: '',
      plot: 'Nessuna trama disponibile',
      runtime: 0,
      releaseYear: new Date().getFullYear(),
      genres: [],
      actors: [],
      director: '',
      country: '',
      language: '',
      revenue: 0,
      oscarAwards: 0,
      rating: 0,
      trailerUrl: '',
      posterUrl: '',
      backgroundUrl: '',
      logoUrl: '',
      metadataSource: 'default',
    };
  }

  // ============================
  // AGGIORNAMENTO DB
  // ============================

  private async updateMediaInDb(
    mediaId: string,
    metadata: MetadataDto,
    source: string,
    mediaTitle?: string,
  ): Promise<void> {
    await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        title: metadata.title,
        originalTitle: metadata.originalTitle,
        plot: metadata.plot,
        runtime: metadata.runtime,
        releaseYear: metadata.releaseYear,
        genres: metadata.genres || [],
        actors: metadata.actors || [],
        director: metadata.director,
        country: metadata.country,
        language: metadata.language,
        revenue: metadata.revenue,
        oscarAwards: metadata.oscarAwards,
        rating: metadata.rating,
        trailerUrl: metadata.trailerUrl,
        posterUrl: metadata.posterUrl,
        backgroundUrl: metadata.backgroundUrl,
        logoUrl: metadata.logoUrl,
        metadataSource: source,
      },
    });

    // 🔇 NESSUNA notifica per-media: le notifiche aggregate vengono
    //    emesse da MediaScannerService.scanAllDevices() a fine scansione.
  }

  // ============================
  // AGGIORNAMENTO IMMAGINI — CACHE FIRST
  // ============================

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async findImageFile(folderPath: string, baseName: string): Promise<string | null> {
    for (const ext of this.IMAGE_EXTENSIONS) {
      const filePath = path.join(folderPath, `${baseName}${ext}`);
      try {
        await fs.access(filePath);
        return filePath;
      } catch {
        // prossima estensione
      }
    }
    return null;
  }

  private async resolveImagePath(
    mediaId: string,
    folderPath: string,
    imageType: 'poster' | 'background',
    currentUrl?: string | null,
  ): Promise<string | undefined> {
    if (currentUrl && currentUrl.trim() !== '' && (await this.fileExists(currentUrl))) {
      this.logger.log(`✅ ${imageType} mantenuto da URL corrente: ${currentUrl}`);
      return currentUrl;
    }

    // [FIX] Cerca in cache tutte le estensioni, non solo .jpg
    const cacheDir =
      imageType === 'poster'
        ? this.coreService.getMediaPosterCachePath()
        : this.coreService.getMediaBackgroundCachePath();
    const cachedPath = await this.findCachedImage(cacheDir, mediaId);
    if (cachedPath) {
      this.logger.log(`✅ ${imageType} da cache: ${cachedPath}`);
      return cachedPath;
    }

    const folderFile = await this.findImageFile(folderPath, imageType);
    if (folderFile) {
      this.logger.log(`📁 ${imageType} da folder legacy: ${folderFile}`);
      return folderFile;
    }

    const defaultFile = await this.findDefaultImage(imageType);
    if (defaultFile) {
      this.logger.log(`🖼️ ${imageType} di default: ${defaultFile}`);
      return defaultFile;
    }

    return currentUrl || undefined;
  }

  // [NEW] Cerca in una cartella un file con nome base {baseName} e una qualsiasi
  //       delle estensioni supportate (jpg, jpeg, png, webp, bmp).
  private async findCachedImage(
    dir: string,
    baseName: string,
  ): Promise<string | null> {
    for (const ext of this.IMAGE_EXTENSIONS) {
      const filePath = path.join(dir, `${baseName}${ext}`);
      if (await this.fileExists(filePath)) {
        return filePath;
      }
    }
    return null;
  }

  private async updateMediaImages(
    mediaId: string,
    folderPath: string,
    source: string,
  ): Promise<void> {
    const current = await this.prisma.media.findUnique({
      where: { id: mediaId },
      select: { posterUrl: true, backgroundUrl: true },
    });

    const posterUrl = await this.resolveImagePath(
      mediaId,
      folderPath,
      'poster',
      current?.posterUrl,
    );
    const backgroundUrl = await this.resolveImagePath(
      mediaId,
      folderPath,
      'background',
      current?.backgroundUrl,
    );

    await this.prisma.media.update({
      where: { id: mediaId },
      data: { posterUrl, backgroundUrl },
    });

    this.logger.log(`💾 Immagini salvate nel DB per media ${mediaId}`);
  }

  private async findDefaultImage(imageName: string): Promise<string | null> {
    const possiblePaths = [
      path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default'),
      path.join(process.cwd(), '..', 'frontend', 'src', 'assets', 'default'),
      path.join(process.cwd(), 'public', 'assets', 'default'),
      path.join(process.cwd(), 'src', 'assets', 'default'),
    ];

    for (const basePath of possiblePaths) {
      const found = await this.findImageFile(basePath, imageName);
      if (found) {
        return found;
      }
    }

    return null;
  }

  // ============================================================
  // [NEW] SALVATAGGIO METADATI LOCALI (scheda "Modifica Metadati")
  // ============================================================

  /**
   * 💾 Salva i metadati inseriti manualmente dall'utente per un MOVIE.
   *    - Aggiorna il DB
   *    - Riscrive metadata.json nella folderPath (best-effort)
   *    - Setta metadataSource = 'local'
   */
  async saveLocalMetadata(
    mediaId: string,
    dto: UpdateMediaMetadataDto,
  ): Promise<any> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException(`Media con ID ${mediaId} non trovato`);
    }

    if (media.type === 'EPISODE') {
      throw new BadRequestException(
        'Non è possibile modificare i metadati di un episodio (la cartella è condivisa con altri episodi).',
      );
    }

    const updated = await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        title: dto.title,
        originalTitle: dto.originalTitle ?? null,
        plot: dto.plot ?? null,
        runtime: dto.runtime ?? null,
        releaseYear: dto.releaseYear ?? null,
        genres: dto.genres ?? [],
        actors: dto.actors ?? [],
        director: dto.director ?? null,
        country: dto.country ?? null,
        language: dto.language ?? null,
        revenue: dto.revenue ?? null,
        oscarAwards: dto.oscarAwards ?? null,
        rating: dto.rating ?? null,
        trailerUrl: dto.trailerUrl ?? null,
        logoUrl: dto.logoUrl ?? null,
        metadataSource: 'local',
      },
    });

    this.logger.log(`💾 Metadati locali salvati per "${updated.title}" (${mediaId})`);

    // Best-effort: riscrivi metadata.json accanto al file video
    await this.syncMetadataJson(mediaId);

    return updated;
  }

  /**
   * 🖼️ Salva un'immagine (poster o background) caricata dall'utente per un MOVIE.
   *    - Mantiene l'estensione originale del file caricato
   *    - Elimina eventuali versioni precedenti con altre estensioni
   *    - Aggiorna il DB e riscrive metadata.json
   */
  async saveMediaImage(
    mediaId: string,
    file: Express.Multer.File,
    type: 'poster' | 'background',
  ): Promise<{ url: string }> {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) {
      throw new NotFoundException(`Media con ID ${mediaId} non trovato`);
    }
    if (media.type === 'EPISODE') {
      throw new BadRequestException(
        'Non è possibile modificare le immagini di un episodio.',
      );
    }

    const cacheDir =
      type === 'poster'
        ? this.coreService.getMediaPosterCachePath()
        : this.coreService.getMediaBackgroundCachePath();

    await fs.mkdir(cacheDir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const validExt = this.IMAGE_EXTENSIONS.includes(ext) ? ext : '.jpg';

    // Pulisci eventuali file precedenti con la stessa base ma estensione diversa
    try {
      const entries = await fs.readdir(cacheDir);
      const baseName = mediaId;
      for (const entry of entries) {
        const parsed = path.parse(entry);
        if (parsed.name === baseName && entry !== `${baseName}${validExt}`) {
          await fs.unlink(path.join(cacheDir, entry)).catch(() => {});
        }
      }
    } catch {
      /* cartella potrebbe non esistere: non è un errore */
    }

    const destPath = path.join(cacheDir, `${mediaId}${validExt}`);
    await fs.writeFile(destPath, file.buffer);

    await this.prisma.media.update({
      where: { id: mediaId },
      data: type === 'poster' ? { posterUrl: destPath } : { backgroundUrl: destPath },
    });

    this.logger.log(
      `🖼️ ${type} salvato per "${media.title}": ${destPath}`,
    );

    // Riscrivi metadata.json per tenere il file allineato con il DB
    await this.syncMetadataJson(mediaId);

    return { url: destPath };
  }

  /**
   * 📝 Riscrive metadata.json nella folderPath del media leggendo lo stato
   *    attuale dal DB. Best-effort: se il disco è read-only o scollegato,
   *    logga un warning ma non lancia eccezioni.
   */
  private async syncMetadataJson(mediaId: string): Promise<void> {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) return;

    const folderPath = this.getMediaFolderPath(media);
    if (!folderPath) {
      this.logger.warn(`⚠️ folderPath non determinabile per ${mediaId}, metadata.json non scritto`);
      return;
    }

    const payload: MetadataDto = {
      title: media.title,
      originalTitle: media.originalTitle ?? undefined,
      plot: media.plot ?? undefined,
      runtime: media.runtime ?? undefined,
      releaseYear: media.releaseYear ?? undefined,
      genres: Array.isArray(media.genres) ? (media.genres as string[]) : [],
      actors: Array.isArray(media.actors) ? (media.actors as string[]) : [],
      director: media.director ?? undefined,
      country: media.country ?? undefined,
      language: media.language ?? undefined,
      revenue: media.revenue ?? undefined,
      oscarAwards: media.oscarAwards ?? undefined,
      rating: media.rating ?? undefined,
      trailerUrl: media.trailerUrl ?? undefined,
      posterUrl: media.posterUrl ?? undefined,
      backgroundUrl: media.backgroundUrl ?? undefined,
      logoUrl: media.logoUrl ?? undefined,
      metadataSource: 'local',
    };

    const target = path.join(folderPath, 'metadata.json');
    const tmp = path.join(folderPath, '.metadata.json.tmp');

    try {
      await fs.writeFile(tmp, JSON.stringify(payload, null, 2), 'utf-8');
      await fs.rename(tmp, target);
      this.logger.log(`📝 metadata.json aggiornato: ${target}`);
    } catch (err: any) {
      this.logger.warn(
        `⚠️ metadata.json non scritto per ${mediaId}: ${err.message}`,
      );
      // Cleanup del tmp se rimasto orfano
      try { await fs.unlink(tmp); } catch { /* ignore */ }
    }
  }

  // ============================================================
  // [NEW] SALVATAGGIO METADATI SERIE PERSONALI
  // ============================================================

  /**
   * 💾 Salva i metadati inseriti manualmente dall'utente per una Serie.
   *    - Aggiorna il DB
   *    - Riscrive series_metadata.json nella folderPath condivisa degli episodi
   *    - Setta metadataSource = 'local'
   */
  async saveLocalSeriesMetadata(
    seriesId: string,
    dto: UpdateSeriesMetadataDto,
  ): Promise<any> {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      throw new NotFoundException(`Serie con ID ${seriesId} non trovata`);
    }

    const updated = await this.prisma.series.update({
      where: { id: seriesId },
      data: {
        title: dto.title,
        originalTitle: dto.originalTitle ?? null,
        plot: dto.plot ?? null,
        genres: dto.genres ?? [],
        actors: dto.actors ?? [],
        director: dto.director ?? null,
        country: dto.country ?? null,
        language: dto.language ?? null,
        rating: dto.rating ?? null,
        releaseYear: dto.releaseYear ?? null,
        runtime: dto.runtime ?? null,
        metadataSource: 'local',
      },
    });

    this.logger.log(
      `💾 Metadati serie salvati per "${updated.title}" (${seriesId})`,
    );

    await this.syncSeriesMetadataJson(seriesId);

    return updated;
  }

  /**
   * 🖼️ Salva un'immagine (poster o background) caricata dall'utente per una Serie.
   *    - Salva nella cache centralizzata con nome series_<seriesId>.<ext>
   *    - Elimina eventuali versioni precedenti con altre estensioni
   *    - Se è un POSTER, aggiorna anche tutti gli episodi (eredità)
   *    - Riscrive series_metadata.json
   */
  async saveSeriesImage(
    seriesId: string,
    file: Express.Multer.File,
    type: 'poster' | 'background',
  ): Promise<{ url: string }> {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
    });
    if (!series) {
      throw new NotFoundException(`Serie con ID ${seriesId} non trovata`);
    }

    const cacheDir =
      type === 'poster'
        ? this.coreService.getMediaPosterCachePath()
        : this.coreService.getMediaBackgroundCachePath();

    await fs.mkdir(cacheDir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const validExt = this.IMAGE_EXTENSIONS.includes(ext) ? ext : '.jpg';
    const baseName = `series_${seriesId}`;

    // Pulizia versioni precedenti con estensione diversa
    try {
      const entries = await fs.readdir(cacheDir);
      for (const entry of entries) {
        const parsed = path.parse(entry);
        if (parsed.name === baseName && entry !== `${baseName}${validExt}`) {
          await fs.unlink(path.join(cacheDir, entry)).catch(() => {});
        }
      }
    } catch {
      /* cartella potrebbe non esistere */
    }

    const destPath = path.join(cacheDir, `${baseName}${validExt}`);
    await fs.writeFile(destPath, file.buffer);

    await this.prisma.series.update({
      where: { id: seriesId },
      data:
        type === 'poster'
          ? { posterUrl: destPath }
          : { backgroundUrl: destPath },
    });

    // 🔥 Se è il POSTER della serie, tutti gli episodi ereditano
    if (type === 'poster') {
      await this.prisma.media.updateMany({
        where: { seriesId },
        data: { posterUrl: destPath },
      });
      this.logger.log(
        `🖼️ Poster serie propagato a tutti gli episodi di ${seriesId}`,
      );
    }

    this.logger.log(`🖼️ ${type} serie salvato: ${destPath}`);

    await this.syncSeriesMetadataJson(seriesId);

    return { url: destPath };
  }

  /**
   * 📝 Riscrive series_metadata.json nella cartella condivisa degli episodi.
   *    Usa la folderPath del primo episodio trovato. Best-effort.
   */
  private async syncSeriesMetadataJson(seriesId: string): Promise<void> {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
    });
    if (!series) return;

    // Trova la folderPath del primo episodio (le cartelle sono tipicamente condivise)
    const firstEpisode = await this.prisma.media.findFirst({
      where: { seriesId, folderPath: { not: null } },
      select: { folderPath: true },
      orderBy: { episodeNumber: 'asc' },
    });

    const folderPath = firstEpisode?.folderPath;
    if (!folderPath) {
      this.logger.warn(
        `⚠️ folderPath non determinabile per serie ${seriesId}, series_metadata.json non scritto`,
      );
      return;
    }

    const payload = {
      title: series.title,
      originalTitle: series.originalTitle ?? undefined,
      plot: series.plot ?? undefined,
      genres: Array.isArray(series.genres) ? (series.genres as string[]) : [],
      actors: Array.isArray(series.actors) ? (series.actors as string[]) : [],
      director: series.director ?? undefined,
      country: series.country ?? undefined,
      language: series.language ?? undefined,
      rating: series.rating ?? undefined,
      releaseYear: series.releaseYear ?? undefined,
      runtime: series.runtime ?? undefined,
      posterUrl: series.posterUrl ?? undefined,
      backgroundUrl: series.backgroundUrl ?? undefined,
      metadataSource: 'local',
    };

    const target = path.join(folderPath, 'series_metadata.json');
    const tmp = path.join(folderPath, '.series_metadata.json.tmp');

    try {
      await fs.writeFile(tmp, JSON.stringify(payload, null, 2), 'utf-8');
      await fs.rename(tmp, target);
      this.logger.log(`📝 series_metadata.json aggiornato: ${target}`);
    } catch (err: any) {
      this.logger.warn(
        `⚠️ series_metadata.json non scritto per ${seriesId}: ${err.message}`,
      );
      try {
        await fs.unlink(tmp);
      } catch {
        /* ignore */
      }
    }
  }

  // ============================================================
  // [NEW] SALVATAGGIO METADATI EPISODIO PERSONALE
  // ============================================================

  /**
   * 💾 Salva i metadati inseriti manualmente per un episodio.
   *    Genere / Cast / Regista / Anno / Lingua sono ereditati dalla serie
   *    e non modificabili da qui.
   *    Non scrive metadata.json (folderPath è condivisa tra più episodi).
   */
  async saveLocalEpisodeMetadata(
    mediaId: string,
    dto: UpdateEpisodeMetadataDto,
  ): Promise<any> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException(`Media con ID ${mediaId} non trovato`);
    }
    if (media.type !== 'EPISODE') {
      throw new BadRequestException(
        'Questo endpoint è riservato agli episodi.',
      );
    }

    const updated = await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        title: dto.title,
        originalTitle: dto.originalTitle ?? null,
        plot: dto.plot ?? null,
        rating: dto.rating ?? null,
        runtime: dto.runtime ?? null,
        country: dto.country ?? null,
        metadataSource: 'local',
      },
    });

    this.logger.log(
      `💾 Metadati episodio salvati per "${updated.title}" (${mediaId})`,
    );

    return updated;
  }

  /**
   * 🖼️ Salva il background (still) di un episodio.
   *    Il poster NON è modificabile da qui: eredita quello della serie.
   */
  async saveEpisodeBackground(
    mediaId: string,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException(`Media con ID ${mediaId} non trovato`);
    }
    if (media.type !== 'EPISODE') {
      throw new BadRequestException(
        'Questo endpoint è riservato agli episodi.',
      );
    }

    const cacheDir = this.coreService.getMediaBackgroundCachePath();
    await fs.mkdir(cacheDir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const validExt = this.IMAGE_EXTENSIONS.includes(ext) ? ext : '.jpg';
    const baseName = mediaId;

    try {
      const entries = await fs.readdir(cacheDir);
      for (const entry of entries) {
        const parsed = path.parse(entry);
        if (parsed.name === baseName && entry !== `${baseName}${validExt}`) {
          await fs.unlink(path.join(cacheDir, entry)).catch(() => {});
        }
      }
    } catch {
      /* cartella potrebbe non esistere */
    }

    const destPath = path.join(cacheDir, `${baseName}${validExt}`);
    await fs.writeFile(destPath, file.buffer);

    await this.prisma.media.update({
      where: { id: mediaId },
      data: { backgroundUrl: destPath },
    });

    this.logger.log(`🖼️ Background episodio salvato: ${destPath}`);

    return { url: destPath };
  }

  // ============================
  // UTILITY
  // ============================

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 🟡 Invia il warning "API mancante" una sola volta per sessione.
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
  
  getActorCacheService(): ActorCacheService {
    return this.actorCache;
  }
}