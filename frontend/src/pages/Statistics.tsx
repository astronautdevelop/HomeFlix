import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, resetStatistics } from '../services/api';
import { Header } from '../components/common/Header';
import { useNotificationStore } from '../stores/notificationStore';

interface StatisticsData {
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
    watchedAt: string;
    posterUrl?: string;
  }[];
}

const fetchStatistics = async (): Promise<StatisticsData> => {
  const response = await api.get('/statistics');
  return response.data;
};

const formatHoursMinutes = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}min`;
};

const MEDALS = ['🥇', '🥈', '🥉'];

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function Statistics() {
  const queryClient = useQueryClient();
  const [resetting, setResetting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['statistics'],
    queryFn: fetchStatistics,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const handleReset = async () => {
    const ok = window.confirm(
      'Sei sicuro di voler azzerare TUTTE le statistiche?\n\n' +
        '• Verranno eliminate le ore guardate\n' +
        '• Verranno azzerati i conteggi "Film più visti"\n' +
        '• Verranno rimossi i "Guardati di recente"\n\n' +
        'Questa azione è irreversibile.',
    );
    if (!ok) return;

    try {
      setResetting(true);
      await resetStatistics();
      await queryClient.invalidateQueries({ queryKey: ['statistics'] });

      useNotificationStore.getState().addNotification({
        id: generateId(),
        type: 'success',
        message: 'Statistiche azzerate correttamente',
        createdAt: new Date(),
        read: false,
      });
    } catch {
      // l'interceptor axios mostra già la notifica di errore
    } finally {
      setResetting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento statistiche...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-red-500 text-xl">Errore: {(error as Error).message}</div>
        </div>
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-monday text-white">📊 Statistiche</h1>
          </div>

          {/* ============ ORE TOTALI + AZZERA ============ */}
          <div className="relative overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 p-8 rounded-2xl mb-8 border border-gray-700/50">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-netflix-red/20 blur-3xl rounded-full" />
            <div className="relative flex justify-between items-center gap-4">
              <div>
                <h2 className="text-gray-400 text-sm uppercase tracking-wider">
                  Ore totali guardate
                </h2>
                <p className="text-5xl font-bold text-white mt-2">
                  {formatHoursMinutes(data.totalHoursWatched)}
                </p>
              </div>
              <button
                onClick={handleReset}
                disabled={resetting}
                title="Azzera tutte le statistiche"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                           bg-red-600/15 hover:bg-red-600/30 border-red-600/50
                           text-red-300 hover:text-red-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetting ? '⏳ Azzerando...' : '🗑️ Azzera Statistiche'}
              </button>
            </div>
          </div>

          {/* ============ FILM PIÙ VISTI (max 4, cliccabili) ============ */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">🎬 Film più visti</h2>
            {data.mostWatchedMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.mostWatchedMovies.slice(0, 4).map((movie, index) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group relative bg-dark-800 rounded-xl overflow-hidden border border-gray-700/50 hover:border-netflix-red transition-all hover:scale-[1.02] block"
                  >
                    <div className="aspect-[2/3] bg-dark-700 relative">
                      <img
                        src={`/media/image/${movie.id}?type=poster`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 text-2xl drop-shadow-lg">
                        {MEDALS[index] ?? ''}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 backdrop-blur text-xs text-white font-bold">
                        {movie.watchCount}×
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white font-medium truncate">{movie.title}</p>
                      <p className="text-gray-400 text-sm">
                        Guardato {movie.watchCount} volte
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nessun film visto più di una volta.</p>
            )}
          </div>

          {/* ============ GENERI PREFERITI — GRAFICO BARRE VERTICALI ============ */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">🏷️ Generi preferiti</h2>
            {data.favoriteGenres.length > 0 ? (
              <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 border border-gray-700/50">
                {(() => {
                  const maxCount = Math.max(...data.favoriteGenres.map((g) => g.count), 1);
                  const CHART_HEIGHT = 200;
                  const MIN_BAR = 6;

                  return (
                    <div className="overflow-x-auto pb-2">
                      <div className="min-w-[560px]">
                        {/* Area barre */}
                        <div
                          className="flex items-end justify-between gap-3 border-b border-gray-700"
                          style={{ height: CHART_HEIGHT }}
                        >
                          {data.favoriteGenres.map((g) => {
                            const barHeight = Math.max(
                              (g.count / maxCount) * (CHART_HEIGHT - 30),
                              MIN_BAR,
                            );
                            return (
                              <div
                                key={g.genre}
                                className="group flex-1 min-w-0 flex flex-col items-center justify-end h-full"
                              >
                                <span className="text-xs text-gray-400 mb-1 tabular-nums">
                                  {g.count}
                                </span>
                                <div
                                  className="w-full max-w-[44px] rounded-t
                                             bg-gray-600
                                             group-hover:bg-gradient-to-t
                                             group-hover:from-yellow-600
                                             group-hover:via-yellow-400
                                             group-hover:to-yellow-300
                                             group-hover:shadow-[0_0_18px_rgba(250,204,21,0.55)]
                                             transition-all duration-300 ease-out
                                             cursor-pointer"
                                  style={{ height: `${barHeight}px` }}
                                  title={`${g.genre}: ${g.count}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {/* Etichette sotto le barre */}
                        <div className="flex justify-between gap-3 mt-3">
                          {data.favoriteGenres.map((g) => (
                            <span
                              key={g.genre}
                              className="flex-1 min-w-0 text-center text-[11px] leading-tight text-gray-400 truncate"
                              title={g.genre}
                            >
                              {g.genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-400">Nessun genere disponibile.</p>
            )}
          </div>

          {/* ============ GUARDATI DI RECENTE (max 6) ============ */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">🕐 Guardati di recente</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {data.recentlyWatched.slice(0, 6).map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="bg-dark-800 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-500 transition-colors block"
                >
                  <div className="aspect-[2/3] bg-dark-700">
                    <img
                      src={`/media/image/${movie.id}?type=poster`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-white text-sm truncate">{movie.title}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(movie.watchedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
              {data.recentlyWatched.length === 0 && (
                <p className="text-gray-400 col-span-full">
                  Nessun film guardato recentemente.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistics;