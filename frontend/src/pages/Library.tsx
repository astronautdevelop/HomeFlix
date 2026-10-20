import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getSeasons } from '../services/api';
import { Header } from '../components/common/Header';
import { MediaRow } from '../components/sections/MediaRow';
import { SeasonRow } from '../components/sections/SeasonRow';
import { ContinueWatching } from '../components/sections/ContinueWatching';
import { EmptyCategories } from '../components/sections/EmptyCategories';
import { GENRE_DISPLAY_NAMES } from '../config/genres';

interface Genre {
  genre: string;
  count: number;
}

export function Library() {
  const { data: allMedia, isLoading: mediaLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => api.get('/media').then((res) => res.data),
  });

  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.get('/media/genres').then((res) => res.data),
  });

  const { data: seasons, isLoading: seasonsLoading } = useQuery({
    queryKey: ['seasons'],
    queryFn: getSeasons,
  });

  const isLoading = mediaLoading || genresLoading || seasonsLoading;

  // Solo film (episodi esclusi a monte dal backend con /media)
  const moviesOnly = useMemo(() => {
    if (!allMedia) return [];
    return allMedia.filter((m: any) => m.type === 'MOVIE');
  }, [allMedia]);

  // Raggruppa i film per genere
  const mediaByGenre = useMemo(() => {
    if (!moviesOnly || !genres) return {};
    const map: Record<string, any[]> = {};

    genres.forEach((g: Genre) => {
      map[g.genre] = [];
    });

    moviesOnly.forEach((m: any) => {
      if (m.genres && Array.isArray(m.genres) && m.genres.length > 0) {
        let hasRecognizedGenre = false;
        for (const g of m.genres) {
          const displayName = GENRE_DISPLAY_NAMES[g] || g;
          if (map[displayName]) {
            map[displayName].push(m);
            hasRecognizedGenre = true;
          }
        }
        if (!hasRecognizedGenre && map['Altro']) {
          map['Altro'].push(m);
        }
      } else {
        if (map['Altro']) {
          map['Altro'].push(m);
        }
      }
    });

    return map;
  }, [moviesOnly, genres]);

  // [NEW] Stagioni senza genere specifico → mostrate in "Serie TV"
  const seasonsTvOnly = useMemo(() => {
    if (!seasons) return [];
    return seasons.filter((s: any) => {
      const gs = Array.isArray(s.genres) ? s.genres : [];
      if (gs.length === 0) return true;
      if (gs.length === 1 && gs[0] === 'Serie TV') return true;
      return gs.includes('Serie TV');
    });
  }, [seasons]);

  // [NEW] Stagioni raggruppate per genere (esclusa "Serie TV")
  const seasonsByGenre = useMemo(() => {
    if (!seasons) return {};
    const map: Record<string, any[]> = {};

    seasons.forEach((s: any) => {
      const gs = Array.isArray(s.genres) ? s.genres : [];
      const specificGenres = gs.filter(
        (g: string) => g !== 'Serie TV' && typeof g === 'string',
      );
      if (specificGenres.length === 0) return;

      specificGenres.forEach((g: string) => {
        const display = GENRE_DISPLAY_NAMES[g] || g;
        if (!map[display]) map[display] = [];
        map[display].push(s);
      });
    });

    return map;
  }, [seasons]);

  // Categorie popolate (Serie TV gestita a parte)
  const populatedGenres = useMemo(
    () =>
      genres?.filter(
        (g: Genre) => g.count > 0 && g.genre !== 'Serie TV',
      ) || [],
    [genres],
  );
  const emptyGenres = genres?.filter((g: Genre) => g.count === 0) || [];

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 w-48 bg-gray-800 rounded mb-3" />
                  <div className="flex gap-3 overflow-x-auto">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="w-40 h-56 bg-gray-800 rounded flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <ContinueWatching />

          {(!genres || genres.length === 0) &&
          (!seasons || seasons.length === 0) ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">Nessun contenuto nella libreria.</p>
              <p className="text-sm mt-2">
                Aggiungi file alla cartella media e avvia la scansione.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6 font-monday">
                📚 Libreria
              </h1>
              <hr className="text-gold mb-3 block" />

              {/* 🔥 Serie TV — una card per stagione (solo senza genere specifico) */}
              {seasonsTvOnly.length > 0 && (
                <SeasonRow title="Serie TV" seasons={seasonsTvOnly} />
              )}

              {/* Film + Serie per genere */}
              {populatedGenres.map((g: Genre) => {
                const movies = mediaByGenre[g.genre] || [];
                const genreSeasons = seasonsByGenre[g.genre] || [];
                const combined = [...movies, ...genreSeasons];

                if (combined.length === 0) {
                  return null;
                }

                return (
                  <MediaRow
                    key={g.genre}
                    title={g.genre}
                    genre={g.genre}
                    media={combined}
                    count={g.count}
                  />
                );
              })}

              <EmptyCategories categories={emptyGenres} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}