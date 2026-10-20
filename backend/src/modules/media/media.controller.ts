import { NotificationManagerService } from '../notification-manager/notification-manager.service';
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  Res,
  Req,
  Delete,
  Patch,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import * as path from 'path';
import { ALL_GENRES, GENRE_DISPLAY_NAMES, SPECIAL_GENRES } from '../../config/genres.config';
import { ActorCacheService } from '../metadata-manager/actor-cache.service';
import { ActorService } from '../actor/actor.service';
import { CoreService } from '../../core/core.service';
import { MetadataManagerService } from '../metadata-manager/metadata-manager.service';
import { UpdateMediaMetadataDto } from '../metadata-manager/dto/update-media-metadata.dto';
import { UpdateSeriesMetadataDto } from '../metadata-manager/dto/update-series-metadata.dto';
import { UpdateEpisodeMetadataDto } from '../metadata-manager/dto/update-episode-metadata.dto';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  private readonly MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly actorCacheService: ActorCacheService,
    private readonly actorService: ActorService,
    private readonly coreService: CoreService,
    private readonly notificationService: NotificationManagerService,
    private readonly metadataManager: MetadataManagerService, // [NEW]
  ) {}

  // ============================================================
  // LISTA MEDIA (esclude episodi — solo film)
  // ============================================================

  @Get()
  async listAllMedia(@Query('includeEpisodes') includeEpisodes?: string) {
    const includeEp = includeEpisodes === 'true';

    return this.prisma.media.findMany({
      where: includeEp ? undefined : { type: { not: 'EPISODE' } },
      select: {
        id: true,
        title: true,
        type: true,
        posterUrl: true,
        backgroundUrl: true,
        releaseYear: true,
        rating: true,
        metadataSource: true,
        runtime: true,
        genres: true,
        actors: true,
        director: true,
        plot: true,
        createdAt: true,
        available: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  // ============================================================
  // SERIE TV — LISTA STAGIONI AGGREGATE (per la home)
  // ============================================================

  @Get('seasons')
  async getSeasons() {
    try {
      const seasons = await this.prisma.season.findMany({
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

      return seasons.map((s) => ({
        id: s.id,
        type: 'SEASON',
        seriesId: s.seriesId,
        seriesTitle: s.series.title,
        posterUrl: s.series.posterUrl,
        backgroundUrl: s.series.backgroundUrl,
        releaseYear: s.series.releaseYear,
        rating: s.series.rating,
        genres: s.series.genres, // ← [NEW] ora il frontend può raggruppare
        seasonNumber: s.seasonNumber,
        seasonTitle: s.title,
        episodesCount: s.episodes.length,
        episodesAvailable: s.episodes.filter((e) => e.available).length,
        totalRuntime: s.episodes.reduce(
          (sum, e) => sum + (e.runtime || 0),
          0,
        ),
      }));
    } catch (error) {
      this.logger.error('Errore recupero stagioni', error.stack);
      return [];
    }
  }

  // ============================================================
  // DETTAGLIO STAGIONE + EPISODI
  // ============================================================

  @Get('seasons/:seasonId')
  async getSeasonDetails(@Param('seasonId') seasonId: string) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
      include: {
        series: true,
        episodes: {
          orderBy: { episodeNumber: 'asc' },
          select: {
            id: true,
            title: true,
            originalTitle: true,
            episodeNumber: true,
            plot: true,
            runtime: true,
            available: true,
            rating: true,
            releaseYear: true,
            posterUrl: true,
            backgroundUrl: true,
            type: true,
          },
        },
      },
    });

    if (!season) {
      throw new NotFoundException('Stagione non trovata');
    }

    return {
      season: {
        id: season.id,
        seriesId: season.seriesId,
        seasonNumber: season.seasonNumber,
        title: season.title,
        posterUrl: season.series.posterUrl,
        backgroundUrl: season.series.backgroundUrl,
      },
      series: {
        id: season.series.id,
        title: season.series.title,
        originalTitle: season.series.originalTitle,
        plot: season.series.plot,
        rating: season.series.rating,
        releaseYear: season.series.releaseYear,
        runtime: season.series.runtime,
        genres: season.series.genres,
        actors: season.series.actors,
        director: season.series.director,
        country: season.series.country,
        language: season.series.language,
        posterUrl: season.series.posterUrl,
        backgroundUrl: season.series.backgroundUrl,
        metadataSource: season.series.metadataSource,
      },
      episodes: season.episodes,
    };
  }

  // ============================================================
  // IMMAGINI SERIE (poster/background di Series)
  // ============================================================

  @Get('series/:seriesId/image')
  async getSeriesImage(
    @Param('seriesId') seriesId: string,
    @Query('type') type: 'poster' | 'background' = 'poster',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { posterUrl: true, backgroundUrl: true },
    });

    if (!series) {
      throw new NotFoundException('Serie not found');
    }

    const filePath = type === 'poster' ? series.posterUrl : series.backgroundUrl;

    if (filePath && fs.existsSync(filePath)) {
      return this.streamImage(res, filePath, req);
    }

    const defaultImage =
      type === 'poster'
        ? path.join(process.cwd(), 'public', 'assets', 'default', 'poster.jpg')
        : path.join(process.cwd(), 'public', 'assets', 'default', 'background.jpg');

    if (fs.existsSync(defaultImage)) {
      return this.streamImage(res, defaultImage, req);
    }

    const frontendDefault =
      type === 'poster'
        ? path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'poster.jpg')
        : path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'background.jpg');

    if (fs.existsSync(frontendDefault)) {
      return this.streamImage(res, frontendDefault, req);
    }

    throw new NotFoundException('Image not found');
  }

  // ============================================================
  // CONTINUE WATCHING ARRICCHITO (con info serie)
  // ============================================================

  @Get('continue-watching')
  async getContinueWatchingEnriched() {
    try {
      // 🔥 progress è in SECONDI, non in percentuale.
      //    Filtriamo solo > 0 e calcoliamo la % in JS (come il vecchio endpoint).
      const history = await this.prisma.watchHistory.findMany({
        where: { progress: { gt: 0 } },
        orderBy: { watchedAt: 'desc' },
        take: 30,
        include: {
          media: {
            include: {
              season: true,
              series: true,
            },
          },
        },
      });

      // Dedup per mediaId
      const seen = new Set<string>();
      const unique = history.filter((h) => {
        if (seen.has(h.mediaId)) return false;
        seen.add(h.mediaId);
        return true;
      });

      const output = unique
        .filter((h) => h.media.available !== false)
        .map((h) => {
          const media = h.media;
          const runtimeMinutes = media.runtime || 0;
          const runtimeSeconds = runtimeMinutes * 60;
          const progressSeconds = h.progress ?? 0;

          const progressPercent =
            runtimeSeconds > 0 ? (progressSeconds / runtimeSeconds) * 100 : 0;

          const remainingSeconds = Math.max(0, runtimeSeconds - progressSeconds);
          const remainingMinutes = Math.ceil(remainingSeconds / 60);

          return {
            id: media.id,
            title: media.title,
            type: media.type,
            posterUrl: media.posterUrl,
            backgroundUrl: media.backgroundUrl,
            releaseYear: media.releaseYear,
            rating: media.rating,
            runtime: runtimeMinutes,
            progress: progressSeconds,
            progressPercent: Math.min(progressPercent, 100),
            remainingMinutes,
            available: media.available,
            seriesId: media.seriesId || null,
            seriesTitle: media.series?.title || null,
            seasonId: media.seasonId || null,
            seasonNumber: media.season?.seasonNumber || null,
            episodeNumber: media.episodeNumber || null,
          };
        });

      // 🔥 Applica soglia 2%-85% (in JS) come da logica originale
      return output.filter(
        (item) => item.progressPercent >= 2 && item.progressPercent <= 85,
      );
    } catch (error) {
      this.logger.error('Errore continue-watching', error.stack);
      return [];
    }
  }

  // ============================================================
  // SEARCH
  // ============================================================

  @Get('search')
  async searchMedia(@Query('q') query?: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim();

    const results = await this.prisma.media.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { originalTitle: { contains: searchTerm, mode: 'insensitive' } },
          { director: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        season: true,
        series: true,
      },
      take: 40,
      orderBy: { title: 'asc' },
    });

    // 🔥 Aggrega episodi per seriesId (una sola "card serie" per volta)
    const seenSeries = new Set<string>();
    const output: any[] = [];

    for (const item of results) {
      if (item.type === 'EPISODE') {
        if (!item.seriesId) continue;
        if (seenSeries.has(item.seriesId)) continue;
        seenSeries.add(item.seriesId);

        // Trova la prima stagione della serie (con id) per il link
        const firstSeason = await this.prisma.season.findFirst({
          where: { seriesId: item.seriesId },
          orderBy: { seasonNumber: 'asc' },
        });

        output.push({
          id: item.seriesId,
          type: 'SERIES',
          title: item.series?.title || item.title,
          posterUrl: item.series?.posterUrl || null,
          releaseYear: item.series?.releaseYear || null,
          rating: item.series?.rating || null,
          seasonId: firstSeason?.id || null,
          seasonsCount: await this.prisma.season.count({
            where: { seriesId: item.seriesId },
          }),
        });
      } else {
        output.push({
          id: item.id,
          title: item.title,
          posterUrl: item.posterUrl,
          releaseYear: item.releaseYear,
          rating: item.rating,
          type: item.type,
        });
      }
    }

    return output.slice(0, 20);
  }

  // ============================================================
  // RANDOM (film + serie TV)
  // ============================================================

  @Get('random')
  async getRandomMedia() {
    // 1) Conteggio film disponibili
    const movieCount = await this.prisma.media.count({
      where: { type: 'MOVIE', available: true },
    });

    // 2) Serie TV distinte che hanno almeno una stagione
    const seriesWithSeasons = await this.prisma.season.findMany({
      distinct: ['seriesId'],
      select: { seriesId: true },
    });
    const seriesCount = seriesWithSeasons.length;

    const total = movieCount + seriesCount;
    if (total === 0) {
      throw new NotFoundException('Nessun contenuto trovato');
    }

    const pick = Math.floor(Math.random() * total);

    // ---- RAMO FILM ----
    if (pick < movieCount) {
      const media = await this.prisma.media.findMany({
        where: { type: 'MOVIE', available: true },
        skip: pick,
        take: 1,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          title: true,
          posterUrl: true,
          backgroundUrl: true,
          releaseYear: true,
          rating: true,
          plot: true,
          type: true,
        },
      });
      return media[0] || null;
    }

    // ---- RAMO SERIE ----
    const seriesIndex = pick - movieCount;
    const seriesId = seriesWithSeasons[seriesIndex].seriesId;

    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: {
        id: true,
        title: true,
        posterUrl: true,
        backgroundUrl: true,
        releaseYear: true,
        rating: true,
        plot: true,
      },
    });

    const firstSeason = await this.prisma.season.findFirst({
      where: { seriesId },
      orderBy: { seasonNumber: 'asc' },
      select: { id: true },
    });

    // Fallback di sicurezza: se per qualche motivo la serie è orfana, ripiega su un film
    if (!series || !firstSeason) {
      const fallback = await this.prisma.media.findFirst({
        where: { type: 'MOVIE', available: true },
        select: {
          id: true,
          title: true,
          posterUrl: true,
          backgroundUrl: true,
          releaseYear: true,
          rating: true,
          plot: true,
          type: true,
        },
      });
      return fallback;
    }

    return {
      id: series.id,
      type: 'SERIES',
      title: series.title,
      posterUrl: series.posterUrl,
      backgroundUrl: series.backgroundUrl,
      releaseYear: series.releaseYear,
      rating: series.rating,
      plot: series.plot,
      seasonId: firstSeason.id,
    };
  }

  // ============================================================
  // GENERI (Serie TV conteggia STAGIONI)
  // ============================================================

  @Get('genres')
  async getGenres() {
    try {
      const allMedia = await this.prisma.media.findMany({
        select: { genres: true, type: true },
      });

      const genreCount: Record<string, number> = {};

      ALL_GENRES.forEach((genre) => {
        genreCount[genre] = 0;
      });
      SPECIAL_GENRES.forEach((genre) => {
        genreCount[genre] = 0;
      });

      let noGenreCount = 0;

      // ---------- FILM ----------
      for (const media of allMedia) {
        if (media.type === 'EPISODE') continue;

        if (media.genres && Array.isArray(media.genres) && media.genres.length > 0) {
          let hasRecognizedGenre = false;
          for (const g of media.genres) {
            if (typeof g === 'string') {
              const displayName = GENRE_DISPLAY_NAMES[g] || g;
              if (ALL_GENRES.includes(displayName)) {
                genreCount[displayName] = (genreCount[displayName] || 0) + 1;
                hasRecognizedGenre = true;
              }
            }
          }
          if (!hasRecognizedGenre) {
            noGenreCount++;
          }
        } else {
          noGenreCount++;
        }
      }

      if (noGenreCount > 0) {
        genreCount['Altro'] = noGenreCount;
      }

      // ---------- SERIE ----------
      // Carica tutte le serie con le loro stagioni
      const seriesList = await this.prisma.series.findMany({
        select: {
          id: true,
          genres: true,
          _count: { select: { seasons: true } },
        },
      });

      let seriesTvSeasonsCount = 0;

      for (const s of seriesList) {
        const seasonsOfSeries = s._count.seasons;
        if (seasonsOfSeries === 0) continue;

        const seriesGenres = Array.isArray(s.genres)
          ? (s.genres as string[]).filter((g) => typeof g === 'string')
          : [];

        // Nessun genere specifico (o solo "Serie TV") → fallback "Serie TV"
        const onlySeriesTv =
          seriesGenres.length === 0 ||
          (seriesGenres.length === 1 && seriesGenres[0] === 'Serie TV');

        if (onlySeriesTv) {
          seriesTvSeasonsCount += seasonsOfSeries;
          continue;
        }

        // Conta ogni genere specifico per numero di stagioni
        for (const g of seriesGenres) {
          if (g === 'Serie TV') {
            seriesTvSeasonsCount += seasonsOfSeries;
            continue;
          }
          if (g === 'Altro') {
            genreCount['Altro'] = (genreCount['Altro'] || 0) + seasonsOfSeries;
            continue;
          }
          const displayName = GENRE_DISPLAY_NAMES[g] || g;
          if (ALL_GENRES.includes(displayName)) {
            genreCount[displayName] =
              (genreCount[displayName] || 0) + seasonsOfSeries;
          } else {
            genreCount['Altro'] = (genreCount['Altro'] || 0) + seasonsOfSeries;
          }
        }
      }

      if (seriesTvSeasonsCount > 0) {
        genreCount['Serie TV'] = seriesTvSeasonsCount;
      }

      return Object.entries(genreCount)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => {
          if (a.count !== b.count) return b.count - a.count;
          return a.genre.localeCompare(b.genre);
        });
    } catch (error) {
      this.logger.error('Errore recupero generi', error.stack);
      return ALL_GENRES.map((genre) => ({ genre, count: 0 }));
    }
  }

  // ============================================================
  // FILM PER GENERE (Serie TV → stagioni aggregate)
  // ============================================================

  @Get('by-genre/:genre')
  async getMediaByGenre(@Param('genre') genre: string) {
    try {
      const decodedGenre = decodeURIComponent(genre);

      // ---------- "Altro" → film senza genere + serie con "Altro" ----------
      if (decodedGenre === 'Altro') {
        const movies = await this.prisma.$queryRaw`
          SELECT *
          FROM "Media"
          WHERE (genres IS NULL OR jsonb_array_length(genres) = 0)
            AND type = 'MOVIE'
          ORDER BY title ASC
        `;

        const seriesWithAltro = await this.prisma.$queryRaw<{ id: string }[]>`
          SELECT id FROM "Series"
          WHERE genres @> '["Altro"]'::jsonb
        `;

        if (seriesWithAltro.length === 0) return movies;

        const seasons = await this.prisma.season.findMany({
          where: { seriesId: { in: seriesWithAltro.map((s) => s.id) } },
          include: {
            series: true,
            episodes: { select: { id: true, available: true, runtime: true } },
          },
          orderBy: [{ series: { title: 'asc' } }, { seasonNumber: 'asc' }],
        });

        return [...(movies as any[]), ...this.mapSeasons(seasons)];
      }

      // ---------- "Serie TV" → solo serie senza genere specifico ----------
      if (decodedGenre === 'Serie TV') {
        const seriesList = await this.prisma.series.findMany({
          select: { id: true, genres: true },
        });

        const eligibleIds = seriesList
          .filter((s) => {
            const gs = Array.isArray(s.genres)
              ? (s.genres as string[]).filter((g) => typeof g === 'string')
              : [];
            return (
              gs.length === 0 ||
              (gs.length === 1 && gs[0] === 'Serie TV') ||
              gs.includes('Serie TV')
            );
          })
          .map((s) => s.id);

        if (eligibleIds.length === 0) return [];

        const seasons = await this.prisma.season.findMany({
          where: { seriesId: { in: eligibleIds } },
          include: {
            series: true,
            episodes: { select: { id: true, available: true, runtime: true } },
          },
          orderBy: [{ series: { title: 'asc' } }, { seasonNumber: 'asc' }],
        });

        return this.mapSeasons(seasons);
      }

      // ---------- Generi normali: film + serie ----------
      const originalGenre = this.getOriginalGenre(decodedGenre);
      const genreToSearch = originalGenre || decodedGenre;

      const movies = await this.prisma.$queryRaw`
        SELECT *
        FROM "Media"
        WHERE genres @> ${JSON.stringify([genreToSearch])}::jsonb
          AND type = 'MOVIE'
        ORDER BY title ASC
      `;

      const seriesWithGenre = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Series"
        WHERE genres @> ${JSON.stringify([genreToSearch])}::jsonb
      `;

      if (seriesWithGenre.length === 0) {
        return movies;
      }

      const seasons = await this.prisma.season.findMany({
        where: { seriesId: { in: seriesWithGenre.map((s) => s.id) } },
        include: {
          series: true,
          episodes: { select: { id: true, available: true, runtime: true } },
        },
        orderBy: [{ series: { title: 'asc' } }, { seasonNumber: 'asc' }],
      });

      return [...(movies as any[]), ...this.mapSeasons(seasons)];
    } catch (error) {
      this.logger.error(
        `Errore recupero film per genere ${genre}`,
        error.stack,
      );
      throw new NotFoundException(`Genere ${genre} non trovato`);
    }
  }

  /**
   * 🎬 Mappa un array di Season (con relations caricate) nel formato
   *     atteso dal frontend per la visualizzazione a card stagione.
   */
  private mapSeasons(seasons: any[]) {
    return seasons.map((s) => ({
      id: s.id,
      type: 'SEASON',
      seriesId: s.seriesId,
      seriesTitle: s.series.title,
      posterUrl: s.series.posterUrl,
      backgroundUrl: s.series.backgroundUrl,
      releaseYear: s.series.releaseYear,
      rating: s.series.rating,
      genres: s.series.genres,
      seasonNumber: s.seasonNumber,
      episodesCount: s.episodes.length,
      episodesAvailable: s.episodes.filter((e: any) => e.available).length,
    }));
  }

  // ============================================================
  // IMMAGINI MEDIA (film)
  // ============================================================

  @Get('image/:mediaId')
  async getImage(
    @Param('mediaId') mediaId: string,
    @Query('type') type: 'poster' | 'background' = 'poster',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      select: { posterUrl: true, backgroundUrl: true },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const filePath = type === 'poster' ? media.posterUrl : media.backgroundUrl;

    this.logger.log(`🔍 getImage ${mediaId} type=${type} filePath=${filePath} exists=${filePath ? fs.existsSync(filePath) : false}`);

    if (filePath && fs.existsSync(filePath)) {
      return this.streamImage(res, filePath, req);
    }

    const defaultImage =
      type === 'poster'
        ? path.join(process.cwd(), 'public', 'assets', 'default', 'poster.jpg')
        : path.join(process.cwd(), 'public', 'assets', 'default', 'background.jpg');

    if (fs.existsSync(defaultImage)) {
      return this.streamImage(res, defaultImage, req);
    }

    const frontendDefault =
      type === 'poster'
        ? path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'poster.jpg')
        : path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'background.jpg');

    if (fs.existsSync(frontendDefault)) {
      return this.streamImage(res, frontendDefault, req);
    }

    throw new NotFoundException('Image not found');
  }

  private streamImage(res: Response, filePath: string, req?: Request): void {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = this.MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const stat = fs.statSync(filePath);

      // 🎯 ETag basato su mtime + size: cambia automaticamente quando
      //    il file viene sostituito (es. dopo un upload di poster personalizzato).
      const etag = `"${stat.mtimeMs.toString(36)}-${stat.size.toString(36)}"`;

      // 🔥 Cache strategy: il browser può conservare l'immagine, ma DEVE
      //    ricontrollare la validità ad ogni richiesta.
      //    - Se il file è invariato → risposta 304 Not Modified (leggerissima)
      //    - Se il file è cambiato → risposta 200 con contenuto nuovo (aggiornato)
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, no-cache, must-revalidate');

      // 🔥 Se il browser ci ha inviato un If-None-Match che coincide con l'ETag
      //    attuale, rispondiamo 304: "il file non è cambiato, usa la tua copia".
      if (req) {
        const clientEtag = req.headers['if-none-match'];
        if (clientEtag && clientEtag === etag) {
          res.status(304).end();
          return;
        }
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stat.size);

      const stream = createReadStream(filePath);
      stream.on('error', (err) => {
        this.logger.error(`Errore stream immagine ${filePath}: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).end();
        } else {
          res.end();
        }
      });
      stream.pipe(res);
    } catch (err: any) {
      this.logger.error(`Errore serving immagine ${filePath}: ${err.message}`);
      if (!res.headersSent) {
        res.status(404).end();
      }
    }
  }

  // ============================================================
  // [NEW] MODIFICA METADATI — Scheda "Modifica Metadati"
  // ============================================================

  /**
   * 💾 PATCH /media/:id/metadata
   * Salva i campi testuali dei metadati di un MOVIE.
   * Riscrive anche metadata.json nella folderPath.
   */
  @Patch(':id/metadata')
  async updateMediaMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateMediaMetadataDto,
  ) {
    if (!id) {
      throw new BadRequestException('ID del media non fornito');
    }
    return this.metadataManager.saveLocalMetadata(id, dto);
  }

  /**
   * 🖼️ POST /media/:id/metadata/poster
   * Upload immagine poster (multipart/form-data, campo "image").
   * Mantiene l'estensione originale, max 10MB.
   */
  @Post(':id/metadata/poster')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadMediaPoster(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File immagine non fornito');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException("L'immagine non deve superare i 10MB");
    }
    return this.metadataManager.saveMediaImage(id, file, 'poster');
  }

  /**
   * 🖼️ POST /media/:id/metadata/background
   * Upload immagine background (multipart/form-data, campo "image").
   * Mantiene l'estensione originale, max 10MB.
   */
  @Post(':id/metadata/background')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadMediaBackground(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File immagine non fornito');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException("L'immagine non deve superare i 10MB");
    }
    return this.metadataManager.saveMediaImage(id, file, 'background');
  }

  // ============================================================
  // [NEW] MODIFICA METADATI — Serie personali
  // ============================================================

  /**
   * 💾 PATCH /media/series/:seriesId/metadata
   * Salva i campi testuali dei metadati di una Serie personale.
   */
  @Patch('series/:seriesId/metadata')
  async updateSeriesMetadata(
    @Param('seriesId') seriesId: string,
    @Body() dto: UpdateSeriesMetadataDto,
  ) {
    if (!seriesId) {
      throw new BadRequestException('ID della serie non fornito');
    }
    return this.metadataManager.saveLocalSeriesMetadata(seriesId, dto);
  }

  /**
   * 🖼️ POST /media/series/:seriesId/metadata/poster
   * Upload poster della Serie (propaga a tutti gli episodi).
   */
  @Post('series/:seriesId/metadata/poster')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadSeriesPoster(
    @Param('seriesId') seriesId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File immagine non fornito');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException("L'immagine non deve superare i 10MB");
    }
    return this.metadataManager.saveSeriesImage(seriesId, file, 'poster');
  }

  /**
   * 🖼️ POST /media/series/:seriesId/metadata/background
   * Upload background della Serie.
   */
  @Post('series/:seriesId/metadata/background')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadSeriesBackground(
    @Param('seriesId') seriesId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File immagine non fornito');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException("L'immagine non deve superare i 10MB");
    }
    return this.metadataManager.saveSeriesImage(seriesId, file, 'background');
  }

  // ============================================================
  // [NEW] MODIFICA METADATI — Episodi personali
  // ============================================================

  /**
   * 💾 PATCH /media/episodes/:id/metadata
   * Salva i campi testuali dei metadati di un Episodio personale.
   */
  @Patch('episodes/:id/metadata')
  async updateEpisodeMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateEpisodeMetadataDto,
  ) {
    if (!id) {
      throw new BadRequestException('ID del media non fornito');
    }
    return this.metadataManager.saveLocalEpisodeMetadata(id, dto);
  }

  /**
   * 🖼️ POST /media/episodes/:id/metadata/background
   * Upload background (still) dell'episodio.
   */
  @Post('episodes/:id/metadata/background')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadEpisodeBackground(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File immagine non fornito');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException("L'immagine non deve superare i 10MB");
    }
    return this.metadataManager.saveEpisodeBackground(id, file);
  }

  // ============================================================
  // DELETE MEDIA
  // ============================================================

  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    try {
      const media = await this.prisma.media.findUnique({ where: { id } });
      if (!media) {
        throw new NotFoundException(`Media con ID ${id} non trovato`);
      }

      const isEpisode = media.type === 'EPISODE';
      const seriesId = media.seriesId;

      // ---------- 1) Elimina i file sidecar nella folderPath del video ----------
      if (media.folderPath) {
        const filesToDelete = [
          'metadata.json',
          'poster.jpg', 'poster.png',
          'background.jpg', 'background.png',
        ];
        for (const file of filesToDelete) {
          const filePath = path.join(media.folderPath, file);
          try {
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
              this.logger.log(`🗑️ File eliminato: ${filePath}`);
            }
          } catch (err: any) {
            this.logger.warn(`⚠️ Impossibile eliminare ${filePath}: ${err.message}`);
          }
        }
      }

      // ---------- 2) [FIX] Elimina TUTTE le estensioni possibili dalla cache media ----------
      const cacheDirs = [
        this.coreService.getMediaPosterCachePath(),
        this.coreService.getMediaBackgroundCachePath(),
      ];
      for (const dir of cacheDirs) {
        try {
          const entries = await fs.promises.readdir(dir);
          for (const entry of entries) {
            const parsed = path.parse(entry);
            if (parsed.name === id) {
              const filePath = path.join(dir, entry);
              await fs.promises.unlink(filePath);
              this.logger.log(`🗑️ Cache eliminata: ${filePath}`);
            }
          }
        } catch {
          /* cartella potrebbe non esistere: non è un errore */
        }
      }

      // ---------- 3) Elimina record dipendenti + media ----------
      await this.prisma.mediaVersion.deleteMany({ where: { mediaId: id } });
      await this.prisma.watchHistory.deleteMany({ where: { mediaId: id } });
      await this.prisma.collectionMedia.deleteMany({ where: { mediaId: id } });

      await this.prisma.media.delete({ where: { id } });

      this.logger.log(`🗑️ Media eliminato: ${media.title} (${id})`);
      this.notificationService
        .notify(
          'warning',
          `Media eliminato: "${media.title}"`,
          { mediaId: id, title: media.title, type: media.type },
        )
        .catch((err) =>
          this.logger.error('Errore invio notifica eliminazione', err?.stack),
        );

      // ---------- 4) Se era un episodio, valuta se la serie rimane orfana ----------
      if (isEpisode && seriesId) {
        try {
          const remaining = await this.prisma.media.count({
            where: { seriesId },
          });

          if (remaining === 0) {
            // [FIX] Elimina TUTTE le estensioni per le immagini serie
            const seriesCacheDirs = [
              this.coreService.getMediaPosterCachePath(),
              this.coreService.getMediaBackgroundCachePath(),
            ];
            for (const dir of seriesCacheDirs) {
              try {
                const entries = await fs.promises.readdir(dir);
                for (const entry of entries) {
                  const parsed = path.parse(entry);
                  if (parsed.name === `series_${seriesId}`) {
                    const filePath = path.join(dir, entry);
                    await fs.promises.unlink(filePath);
                    this.logger.log(`🗑️ Cache serie eliminata: ${filePath}`);
                  }
                }
              } catch {
                /* cartella potrebbe non esistere */
              }
            }

            await this.prisma.series.delete({ where: { id: seriesId } });
            this.logger.log(`🗑️ Serie eliminata: ${seriesId}`);
          }
        } catch (err: any) {
          this.logger.warn(`⚠️ Errore cleanup serie ${seriesId}: ${err.message}`);
        }
      }

      // ---------- 5) Garbage Collection attori (async, non blocking) ----------
      setImmediate(async () => {
        try {
          const result = await this.actorService.runGarbageCollection();
          this.logger.log(
            `🧹 Garbage Collection attori: ${result.deletedImages} immagini, ${result.deletedMetadata} metadati eliminati`,
          );
        } catch (err) {
          this.logger.error('❌ Errore garbage collection', err.stack);
        }
      });

      return { success: true, message: 'Media eliminato con successo' };
    } catch (error) {
      this.logger.error(`Errore eliminazione media ${id}`, error.stack);
      throw error;
    }
  }

  // ============================================================
  // DELETE STAGIONE INTERA
  // ============================================================

  @Delete('seasons/:seasonId')
  async deleteSeason(@Param('seasonId') seasonId: string) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
      include: { episodes: true },
    });

    if (!season) {
      throw new NotFoundException('Stagione non trovata');
    }

    // 🔑 Nota: nella tabella Season la relazione verso Series è `seriesId`,
    //    quindi qui la variabile utile è `season.seriesId`, non `seriesId`.
    const parentSeriesId = season.seriesId;

    // Elimina ogni episodio (riusa la logica di deleteMedia)
    for (const ep of season.episodes) {
      await this.deleteMedia(ep.id);
    }

    // Se la serie è orfana, elimina cache (tutte le estensioni) e riga Series
    const remaining = await this.prisma.media.count({
      where: { seriesId: parentSeriesId },
    });

    if (remaining === 0) {
      const seriesCacheDirs = [
        this.coreService.getMediaPosterCachePath(),
        this.coreService.getMediaBackgroundCachePath(),
      ];

      for (const dir of seriesCacheDirs) {
        try {
          const entries = await fs.promises.readdir(dir);
          for (const entry of entries) {
            const parsed = path.parse(entry);
            if (parsed.name === `series_${parentSeriesId}`) {
              const filePath = path.join(dir, entry);
              await fs.promises.unlink(filePath);
              this.logger.log(`🗑️ Cache serie eliminata: ${filePath}`);
            }
          }
        } catch {
          /* cartella potrebbe non esistere */
        }
      }

      await this.prisma.series
        .delete({ where: { id: parentSeriesId } })
        .catch(() => {
          /* serie già eliminata da un altro ramo: ignora */
        });
    }

    return { success: true, message: 'Stagione eliminata' };
  }

  // ============================================================
  // GET MEDIA BY ID
  // ============================================================

  @Get(':id')
  async getMediaById(@Param('id') id: string) {
    if (!id) {
      throw new NotFoundException('ID del media non fornito');
    }

    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        versions: true,
        season: true,
        series: true,
      },
    });

    if (!media) {
      throw new NotFoundException(`Media con ID ${id} non trovato`);
    }

    const serialized = {
      ...media,
      versions: media.versions.map((v) => ({
        ...v,
        size: v.size ? Number(v.size) : null,
      })),
    };

    return serialized;
  }

  private getOriginalGenre(displayName: string): string | null {
    const reverseMap: Record<string, string> = {
      'Concerti Live': 'Musica',
    };
    return reverseMap[displayName] || null;
  }
}