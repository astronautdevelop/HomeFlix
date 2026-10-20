import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getContinueWatchingEnriched } from '../../services/api';

interface ContinueWatchingItem {
  id: string;
  title: string;
  type?: string;
  posterUrl?: string | null;
  backgroundUrl?: string | null;
  progress: number;
  progressPercent: number;
  remainingMinutes: number;
  runtime?: number;
  releaseYear?: number;
  rating?: number;
  seriesId?: string | null;
  seriesTitle?: string | null;
  seasonId?: string | null;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
}

export function ContinueWatching() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: getContinueWatchingEnriched,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Continua a guardare</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-40 bg-dark-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-monday text-white mb-4">Continua a guardare</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item: ContinueWatchingItem) => {
          const posterImageUrl = `/media/image/${item.id}?type=poster`;
          const backgroundImageUrl = `/media/image/${item.id}?type=background`;

          const safeProgressPercent = Math.min(
            Math.max(Number(item.progressPercent) || 0, 0),
            100,
          );

          const isEpisode = item.type === 'EPISODE' && item.episodeNumber;

          return (
            <Link
              key={item.id}
              to={`/movie/${item.id}?autoplay=true`}
              className="flex-shrink-0 w-72 h-40 rounded-lg overflow-hidden relative group transition-transform hover:scale-105 duration-200"
            >
              <img
                src={backgroundImageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = posterImageUrl;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* 🔥 Badge S04E03 per gli episodi */}
              {isEpisode && (
                <div className="absolute top-2 left-2 bg-black/80 text-gold text-xs font-bold px-2 py-1 rounded">
                  S{String(item.seasonNumber || 0).padStart(2, '0')}E
                  {String(item.episodeNumber || 0).padStart(2, '0')}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* 🔥 Nome serie + titolo episodio */}
                <p className="text-white font-bold text-sm truncate mb-1">
                  {isEpisode && item.seriesTitle
                    ? item.seriesTitle
                    : item.title}
                </p>
                {isEpisode && (
                  <p className="text-gray-300 text-xs truncate mb-1">
                    {item.title}
                  </p>
                )}

                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${safeProgressPercent}%`,
                      backgroundColor: '#e5aa09',
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-white/70 text-xs">
                    {safeProgressPercent > 0 && safeProgressPercent < 100
                      ? `${Math.round(safeProgressPercent)}%`
                      : 'Inizio'}
                  </span>
                  <span className="text-white/70 text-xs">
                    {item.remainingMinutes > 0
                      ? `${item.remainingMinutes} min rimanenti`
                      : 'Quasi finito'}
                  </span>
                </div>
              </div>

              {item.rating && item.rating > 0 && (
                <div className="absolute top-2 right-2 bg-black/60 text-yellow-400 text-xs px-2 py-0.5 rounded">
                  ⭐ {item.rating.toFixed(1)}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}