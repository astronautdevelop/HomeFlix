import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface StatisticsResponse {
  totalHoursWatched: number;
  mostWatchedMovies: {
    id: string;
    title: string;
    watchCount: number;
    posterUrl?: string;
  }[];
  favoriteGenres: {
    genre: string;
    count: number;
  }[];
  recentlyWatched: {
    id: string;
    title: string;
    watchedAt: Date;
    posterUrl?: string;
  }[];
}

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(): Promise<StatisticsResponse> {
    // ============================================================
    // 1. ORE TOTALI GUARDATE
    //    = (viewCount * runtime) per le visioni complete
    //    + progresso in corso (in secondi → minuti) per i media ancora in watchHistory
    // ============================================================
    const allMedia = await this.prisma.media.findMany({
      select: { id: true, runtime: true, viewCount: true },
    });

    const allHistory = await this.prisma.watchHistory.findMany({
      select: { mediaId: true, progress: true },
    });

    let totalMinutes = 0;

    // Visioni complete: viewCount * runtime (minuti)
    for (const m of allMedia) {
      totalMinutes += (m.viewCount ?? 0) * (m.runtime ?? 0);
    }

    // Progresso in corso (progress è in secondi → /60 = minuti)
    for (const h of allHistory) {
      totalMinutes += (h.progress ?? 0) / 60;
    }

    const totalHoursWatched = Math.round((totalMinutes / 60) * 10) / 10;

    // ============================================================
    // 2. FILM PIÙ VISTI (viewCount > 1, top 4)
    // ============================================================
    const mostWatchedRaw = await this.prisma.media.findMany({
      where: { viewCount: { gt: 1 } },
      orderBy: { viewCount: 'desc' },
      take: 4,
      select: {
        id: true,
        title: true,
        posterUrl: true,
        viewCount: true,
      },
    });

    const mostWatchedMovies = mostWatchedRaw.map((m) => ({
      id: m.id,
      title: m.title || 'Sconosciuto',
      watchCount: m.viewCount,
      posterUrl: m.posterUrl || undefined,
    }));

    // ============================================================
    // 3. GENERI PREFERITI
    //    Peso = viewCount (se > 0) altrimenti 1 per i media ancora in corso
    // ============================================================
    const watchedMedia = await this.prisma.media.findMany({
      where: {
        OR: [
          { viewCount: { gt: 0 } },
          { watchHistory: { some: { progress: { gt: 2 } } } },
        ],
      },
      select: { genres: true, viewCount: true },
    });

    const genreCountMap = new Map<string, number>();

    for (const media of watchedMedia) {
      const weight = media.viewCount > 0 ? media.viewCount : 1;
      const genres = media.genres as any;
      if (Array.isArray(genres)) {
        for (const g of genres) {
          if (typeof g === 'string') {
            genreCountMap.set(g, (genreCountMap.get(g) || 0) + weight);
          }
        }
      }
    }

    const favoriteGenres = Array.from(genreCountMap.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ============================================================
    // 4. RECENTEMENTE GUARDATI (ultimi 6 watchHistory)
    // ============================================================
    const recentHistory = await this.prisma.watchHistory.findMany({
      where: { progress: { gt: 2 } },
      orderBy: { watchedAt: 'desc' },
      take: 6,
      include: {
        media: {
          select: { id: true, title: true, posterUrl: true },
        },
      },
    });

    const recentlyWatched = recentHistory.map((record) => ({
      id: record.media.id,
      title: record.media.title || 'Sconosciuto',
      watchedAt: record.watchedAt,
      posterUrl: record.media.posterUrl || undefined,
    }));

    return {
      totalHoursWatched,
      mostWatchedMovies,
      favoriteGenres,
      recentlyWatched,
    };
  }

  // ============================================================
  // AZZERA STATISTICHE
  // ============================================================
  async resetStatistics(): Promise<{ success: boolean; message: string }> {
    await this.prisma.$transaction([
      this.prisma.watchHistory.deleteMany({}),
      this.prisma.media.updateMany({ data: { viewCount: 0 } }),
    ]);

    return {
      success: true,
      message: 'Statistiche azzerate correttamente',
    };
  }
}