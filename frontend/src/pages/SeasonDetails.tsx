import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getSeasonDetails, getSeriesImage } from '../services/api';
import { Header } from '../components/common/Header';
import { SeriesMetadataEditorForm } from '../components/media/SeriesMetadataEditorForm';

export function SeasonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showSeriesEditor, setShowSeriesEditor] = useState(false);
  const [imageVersion, setImageVersion] = useState<number>(() => Date.now());

  const { data, isLoading, error } = useQuery({
    queryKey: ['season', id],
    queryFn: () => getSeasonDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento stagione...</div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-red-500 text-xl">Stagione non trovata</div>
        </div>
      </>
    );
  }

  const { season, series, episodes } = data;

  const backgroundUrl = series.id
    ? `${getSeriesImage(series.id, 'background')}&v=${imageVersion}`
    : '/assets/default/background.jpg';
  const posterUrl = series.id
    ? `${getSeriesImage(series.id, 'poster')}&v=${imageVersion}`
    : '/assets/default/poster.jpg';

  const handlePlayEpisode = (episodeId: string) => {
    navigate(`/movie/${episodeId}?autoplay=true`);
  };

  // 📝 Scheda modifica visibile solo per serie personali (non TMDB)
  const canEditSeriesMetadata = series.metadataSource !== 'tmdb';

  return (
    <>
      <Header />
      <div className="pt-16">
        {/* Banner */}
        <div
          className="w-full h-[40vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundPosition: 'center 20%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/100" />
        </div>

        {/* Info serie + poster */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-40 md:w-56 flex-shrink-0">
              <img
                src={posterUrl}
                alt={series.title}
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default/poster.jpg';
                }}
              />
            </div>

            <div className="flex-1">
              <Link
                to="/"
                className="inline-block mb-2 gap-2 px-3 py-1 
                text-sm text-gray-400 
                hover:text-white transition-colors bg-red-700 
                border rounded-lg border-gray-400/80 
                hover:bg-red-900 hover:scale-105 
                transition-all duration-200"
              >
                ← Torna alla libreria
              </Link>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {series.title}
                <span className="text-gold text-xl ml-3">
                  · Stagione {season.seasonNumber}
                </span>
              </h1>

              <div className="flex items-center gap-4 mt-3 flex-wrap text-sm">
                {series.rating && series.rating > 0 && (
                  <span className="text-yellow-400">⭐ {series.rating.toFixed(1)}</span>
                )}
                {series.releaseYear && (
                  <span className="text-gray-400">{series.releaseYear}</span>
                )}
                <span className="text-gray-400">
                  {episodes.length} {episodes.length === 1 ? 'episodio' : 'episodi'}
                </span>
                {series.genres && Array.isArray(series.genres) && series.genres.length > 0 && (
                  <span className="text-gray-400">{series.genres.join(', ')}</span>
                )}
                {series.director && (
                  <span className="text-gray-400">
                    Regia: <span className="text-white">{series.director}</span>
                  </span>
                )}
                {series.metadataSource === 'tmdb' && (
                  <span className="text-green-500 text-sm">✓ TMDB</span>
                )}
                {series.metadataSource === 'local' && (
                  <span className="text-blue-400 text-sm">✓ Locale</span>
                )}
              </div>

              {series.plot && (
                <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed max-w-2xl">
                  {series.plot}
                </p>
              )}

              {series.actors && Array.isArray(series.actors) && series.actors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white font-semibold mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {series.actors.slice(0, 8).map((actor: string) => (
                      <Link
                        key={actor}
                        to={`/actor/${encodeURIComponent(actor)}`}
                        className="bg-dark-700 text-gray-300 text-xs px-3 py-1 rounded-full border border-transparent transition-all duration-200 hover:scale-105 hover:bg-yellow-600 hover:text-black"
                      >
                        {actor}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 📝 Pulsante Modifica Metadati Serie */}
              {canEditSeriesMetadata && (
                <div className="mt-5">
                  <button
                    onClick={() => setShowSeriesEditor((s) => !s)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2 border font-medium ${
                      showSeriesEditor
                        ? 'bg-red-800 text-white border-gray-500 hover:border-gray-200 hover:bg-red-900 hover:scale-90'
                        : 'bg-black-800 hover:bg-gray-800 text-white border-dark-600 hover:border-yellow-400 hover:text-netflix-yellow'
                    }`}
                    title={
                      showSeriesEditor
                        ? 'Chiudi la scheda di modifica'
                        : 'Modifica manualmente i metadati della serie'
                    }
                  >
                    {showSeriesEditor ? '✕ Chiudi scheda' : '✏️ Modifica Metadati Serie'}
                  </button>
                </div>
              )}

              {/* 📝 SCHEDA MODIFICA SERIE */}
              {canEditSeriesMetadata && showSeriesEditor && (
                <SeriesMetadataEditorForm
                  series={series}
                  onClose={() => setShowSeriesEditor(false)}
                  onSaved={() => {
                    setImageVersion(Date.now());
                    setShowSeriesEditor(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Lista episodi */}
        <div className="max-w-6xl mx-auto px-4 mt-12 pb-12">
          <h2 className="text-2xl font-monday text-white mb-4">Episodi</h2>

          {episodes.length === 0 ? (
            <p className="text-gray-400">Nessun episodio in questa stagione.</p>
          ) : (
            <div className="space-y-3">
              {episodes.map((ep: any) => {
                const thumbUrl = ep.backgroundUrl
                  ? `/api/media/image/${ep.id}?type=background&v=${imageVersion}`
                  : '/assets/default/background.jpg';
                const isAvailable = ep.available !== false;

                return (
                  <div
                    key={ep.id}
                    className={`flex gap-4 bg-dark-800/60 rounded-lg overflow-hidden transition-colors ${
                      isAvailable ? 'hover:bg-dark-700/80' : 'opacity-60'
                    }`}
                  >
                    <Link
                      to={`/movie/${ep.id}`}
                      className="flex-shrink-0 w-40 sm:w-56 aspect-video bg-black relative overflow-hidden"
                    >
                      <img
                        src={thumbUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/default/background.jpg';
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                        E{ep.episodeNumber}
                      </div>
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="text-white text-xs font-bold bg-red-600/80 px-2 py-1 rounded">
                            ⚠️ NON DISPONIBILE
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/movie/${ep.id}`}>
                            <h3 className="text-white font-bold text-base hover:text-gold transition-colors">
                              {ep.episodeNumber}. {ep.originalTitle || ep.title}
                            </h3>
                          </Link>
                          {ep.rating && ep.rating > 0 && (
                            <span className="text-yellow-400 text-sm whitespace-nowrap">
                              ⭐ {ep.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        {ep.runtime && (
                          <p className="text-gray-500 text-xs mt-0.5">{ep.runtime} min</p>
                        )}
                        {ep.plot && (
                          <p className="text-gray-400 text-sm mt-2 line-clamp-3">{ep.plot}</p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => isAvailable && handlePlayEpisode(ep.id)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border border-gray-400/80 hover:scale-105 text-sm font-bold transition-colors ${
                            isAvailable
                              ? 'bg-green-500 hover:bg-green-700 text-white'
                              : 'bg-gray-600 cursor-not-allowed opacity-50 text-gray-300'
                          }`}
                        >
                          ▶ Play
                        </button>
                        <Link
                          to={`/movie/${ep.id}`}
                          className="px-4 py-2 rounded-lg text-sm border hover:border-gray-400 
                          hover:bg-gray-700 font-medium text-white bg-dark-700 hover:bg-dark-600 transition-colors"
                        >
                          Dettagli
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}