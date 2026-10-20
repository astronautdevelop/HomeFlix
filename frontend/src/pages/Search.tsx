import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Header } from '@/components/common/Header';

interface SearchResult {
  id: string;
  title: string;
  posterUrl?: string | null;
  releaseYear?: number;
  rating?: number;
  type: string;
  seasonId?: string | null;
  seasonsCount?: number;
}

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () =>
      api.get(`/media/search?q=${encodeURIComponent(query)}`).then((res) => res.data),
    enabled: query.length >= 2,
  });

  const results: SearchResult[] = data || [];

  // 🔥 Calcola il link in base al tipo di risultato
  const buildLink = (r: SearchResult): string => {
    if (r.type === 'SERIES' && r.seasonId) {
      return `/season/${r.seasonId}`;
    }
    return `/movie/${r.id}`;
  };

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              {query.length >= 2 ? (
                <>
                  Risultati per "<span className="text-netflix-red">{query}</span>"
                  <span className="text-gray-400 text-base ml-2 font-normal">
                    ({results.length} {results.length === 1 ? 'risultato' : 'risultati'})
                  </span>
                </>
              ) : (
                'Inserisci almeno 2 caratteri per cercare'
              )}
            </h1>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-xl">Ricerca in corso...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500 text-xl">
                Errore durante la ricerca: {(error as Error).message}
              </div>
            </div>
          )}

          {!isLoading && !error && query.length >= 2 && (
            <>
              {results.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-xl">Nessun risultato trovato per "{query}"</p>
                  <p className="text-sm mt-2">Prova con un altro titolo, attore o regista</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.map((media) => {
                    const isSeries = media.type === 'SERIES';
                    const imageUrl = isSeries
                      ? `/api/media/series/${media.id}/image?type=poster`
                      : `/api/media/image/${media.id}?type=poster`;

                    return (
                      <Link
                        key={`${media.type}-${media.id}`}
                        to={buildLink(media)}
                        className="bg-dark-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer group relative"
                      >
                        <div className="aspect-[2/3] bg-dark-700 relative">
                          <img
                            src={imageUrl}
                            alt={media.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                '/assets/default/poster.jpg';
                            }}
                          />
                          {isSeries && (
                            <div className="absolute top-2 left-2 bg-black/80 text-gold text-xs font-bold px-2 py-1 rounded">
                              SERIE
                            </div>
                          )}
                          {media.rating && media.rating > 0 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded">
                              ⭐ {media.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-white text-sm font-medium truncate">
                            {media.title}
                          </p>
                          {media.releaseYear && (
                            <p className="text-gray-400 text-xs">{media.releaseYear}</p>
                          )}
                          {isSeries && media.seasonsCount && (
                            <p className="text-gray-500 text-xs">
                              {media.seasonsCount}{' '}
                              {media.seasonsCount === 1 ? 'stagione' : 'stagioni'}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}