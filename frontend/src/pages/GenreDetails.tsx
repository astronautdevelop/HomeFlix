import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { MediaCard } from '../components/common/MediaCard';
import { SeasonCard } from '../components/common/SeasonCard';
import { CATEGORY_BANNERS, DEFAULT_CATEGORY_BANNER } from '../config/categoryBanners';

export function GenreDetails() {
  const { genre } = useParams<{ genre: string }>();
  const decodedGenre = decodeURIComponent(genre || '');

  const { data: media, isLoading, error } = useQuery({
    queryKey: ['genre', decodedGenre],
    queryFn: () =>
      api
        .get(`/media/by-genre/${encodeURIComponent(decodedGenre)}`)
        .then((res) => res.data),
    enabled: !!decodedGenre,
  });

  const bannerUrl = CATEGORY_BANNERS[decodedGenre] || DEFAULT_CATEGORY_BANNER;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-800 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-800 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto text-red-500">
            Errore nel caricamento dei contenuti per {decodedGenre}
          </div>
        </div>
      </>
    );
  }

  const items = Array.isArray(media) ? media : [];
  const isSeriesCategory = decodedGenre === 'Serie TV';

  return (
    <>
      <Header />

      <div
        className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="px-4 pb-8 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-monday text-white drop-shadow-lg mb-1">
              {decodedGenre}
            </h1>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-3 py-2 bg-red-700 text-gray-300 text-sm 
                rounded-lg hover:bg-red-900 hover:text-white 
                transition-colors border border-gray-700 hover:scale-105 mb-2 block flex items-center gap-1 transition-colors duration-200 text-sm font-medium"
              >
                ← Indietro
              </Link>
              <span className="text-xs font-medium text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                {items.length}{' '}
                {isSeriesCategory
                  ? items.length === 1
                    ? 'stagione'
                    : 'stagioni'
                  : items.length === 1
                  ? 'film'
                  : 'film'}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-400">Nessun contenuto in questa categoria.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {items.map((item: any) =>
                item.type === 'SEASON' ? (
                  <SeasonCard key={item.id} season={item} />
                ) : (
                  <MediaCard key={item.id} media={item} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}