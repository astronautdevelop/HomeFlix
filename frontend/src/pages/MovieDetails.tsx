// src/pages/MovieDetails.tsx (COMPLETO)

import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { getMediaById, getQualities, getProgress, getEpisodeNav } from '@/services/api';
import { usePlayerStore } from '@/stores/playerStore';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { MetadataEditorForm } from '@/components/media/MetadataEditorForm';
import { EpisodeMetadataEditorForm } from '@/components/media/EpisodeMetadataEditorForm';
import { getMediaImageUrl } from '@/services/api';
import { Header } from '@/components/common/Header';

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const autoplay = searchParams.get('autoplay') === 'true';

  const [showPlayer, setShowPlayer] = useState(false);
    // 📝 Scheda Modifica Metadati
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  // 🔄 Cache-busting per le immagini dopo un salvataggio
  const [imageVersion, setImageVersion] = useState<number>(() => Date.now());
  const { setMedia, selectedQuality, setSelectedQuality } = usePlayerStore();

  const { data: media, isLoading: mediaLoading, error: mediaError } = useQuery({
    queryKey: ['media', id],
    queryFn: () => getMediaById(id!).then((res) => res.data),
    enabled: !!id,
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => getProgress(id!),
    enabled: !!id,
  });

  const { data: qualitiesData, isLoading: qualitiesLoading } = useQuery({
    queryKey: ['qualities', id],
    queryFn: () => getQualities(id!).then((res) => res.data),
    enabled: !!id,
  });

  // 🔥 Navigazione episodi (solo per EPISODE)
  const isEpisode = media?.type === 'EPISODE';
  const { data: episodeNav } = useQuery({
    queryKey: ['episode-nav', id],
    queryFn: () => getEpisodeNav(id!),
    enabled: !!id && isEpisode,
    staleTime: 30_000,
  });

  const isAvailable = media?.available !== false;
  const hasProgress = (progressData || 0) > 10;

  const seasonId = media?.seasonId || media?.season?.id || null;
  const seasonNumber = media?.season?.seasonNumber ?? null;
  const episodeNumber = media?.episodeNumber ?? null;
  const seriesTitle = media?.series?.title || null;

  const handlePlay = () => {
    if (!isAvailable) return;
    if (media && qualitiesData) {
      setMedia(media.id, media.title, qualitiesData);
      setShowPlayer(true);
    }
  };

  // Autoplay (mount / cambio id)
  useEffect(() => {
    if (
      autoplay &&
      media &&
      qualitiesData &&
      !showPlayer &&
      !mediaLoading &&
      !qualitiesLoading &&
      isAvailable
    ) {
      setMedia(media.id, media.title, qualitiesData);
      setShowPlayer(true);
    }
  }, [
    autoplay,
    media,
    qualitiesData,
    showPlayer,
    mediaLoading,
    qualitiesLoading,
    setMedia,
    isAvailable,
  ]);

  const handleClosePlayer = () => {
    setShowPlayer(false);
    queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
    queryClient.invalidateQueries({ queryKey: ['progress', id] });

    if (autoplay) {
      navigate('/');
    }
  };

  // 🔥 Navigazione al prossimo / precedente episodio
  const handleNavigateEpisode = useCallback(
    (episodeId: string) => {
      if (!episodeId || episodeId === id) return;

      // Chiudi il player corrente prima di navigare
      setShowPlayer(false);

      // Invalida i dati dell'episodio corrente
      queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
      queryClient.invalidateQueries({ queryKey: ['progress', id] });

      // Naviga al nuovo episodio con autoplay
      navigate(`/movie/${episodeId}?autoplay=true`);
    },
    [id, navigate, queryClient],
  );

  const formatRevenue = (value: number | null | undefined) => {
    if (!value || value === 0) return null;
    return '$ ' + value.toLocaleString('it-IT');
  };

  if (mediaLoading || qualitiesLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento dettagli...</div>
        </div>
      </>
    );
  }

  if (mediaError || !media) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-red-500 text-xl">Contenuto non trovato</div>
        </div>
      </>
    );
  }

  // 🖼️ URL immagini con cache-busting (si aggiorna dopo un salvataggio)
  const posterUrl = getMediaImageUrl(media.id, 'poster', imageVersion);
  const backgroundUrl = getMediaImageUrl(media.id, 'background', imageVersion);

  // 📝 Scheda Modifica Metadati: visibile per MOVIE ed EPISODE non-TMDB
  const canEditMovieMetadata =
    media.type === 'MOVIE' && media.metadataSource !== 'tmdb';
  const canEditEpisodeMetadata =
    media.type === 'EPISODE' && media.metadataSource !== 'tmdb';
  const canEditMetadata = canEditMovieMetadata || canEditEpisodeMetadata;

  const qualities = qualitiesData || [];
  const qualityLabels: Record<string, string> = {
    '4K': '4K Ultra HD',
    'Full HD': 'Full HD 1080p',
    HD: 'HD 720p',
    DVD: 'DVD 480p',
    SD: 'Standard Definition',
  };

  return (
    <>
      <Header />
      <div className="pt-16">
        <div
          className="w-full h-[50vh] bg-cover bg-center relative"
          style={{
            backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
            backgroundColor: backgroundUrl ? 'transparent' : '#1a1a1a',
            backgroundPosition: 'center 20%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/100" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          {isEpisode && seasonId && (
            <div className="mb-4">
              <Link
                to={`/season/${seasonId}`}
                className="inline-flex items-center gap-2 px-2 py-2 
                bg-dark-800/80 backdrop-blur-sm text-white 
                rounded-lg border border-gray-700 
                hover:bg-dark-700 hover:border-yellow-500 
                hover:scale-105 transition-all duration-200 
                text-sm font-medium"
              >
                <span className="text-lg leading-none">←</span>
                Torna alla stagione
                {seriesTitle && (
                  <span className="text-gray-400 ml-1">
                    · {seriesTitle}
                    {seasonNumber !== null && ` · S${String(seasonNumber).padStart(2, '0')}`}
                  </span>
                )}
              </Link>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 flex-shrink-0">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={media.title}
                  className={`w-full rounded-lg shadow-2xl ${!isAvailable ? 'opacity-60' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full aspect-[2/3] bg-dark-800 rounded-lg flex items-center justify-center text-gray-500">
                          🎬
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-dark-800 rounded-lg flex items-center justify-center text-gray-500">
                  🎬
                </div>
              )}
              {!isAvailable && (
                <div className="mt-2 text-center bg-red-900/50 border border-red-500 text-red-200 text-xs px-2 py-1 rounded">
                  ⚠️ DISCO NON COLLEGATO
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEpisode && episodeNumber !== null && (
                <div className="mb-2">
                  <span className="inline-block bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded">
                    STAGIONE {seasonNumber ?? '?'} · EPISODIO {episodeNumber}
                  </span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {isEpisode && media.originalTitle ? (
                  <>
                    {media.originalTitle}
                    {media.releaseYear && (
                      <span className="text-gray-200 text-xl ml-2">
                        ({media.releaseYear})
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {media.title}
                    {media.releaseYear && (
                      <span className="text-gray-200 text-xl ml-2">
                        ({media.releaseYear})
                      </span>
                    )}
                  </>
                )}
              </h1>

              {isEpisode && seriesTitle && (
                <p className="text-gray-400 text-sm mt-1">{media.title}</p>
              )}

              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {media.rating && media.rating > 0 && (
                  <span className="text-yellow-400">⭐ {media.rating.toFixed(1)}</span>
                )}
                {media.runtime && (
                  <span className="text-gray-400">{media.runtime} min</span>
                )}
                {media.genres && Array.isArray(media.genres) && media.genres.length > 0 && (
                  <span className="text-white-400">{media.genres.join(', ')}</span>
                )}
                <span className="text-gray-400 uppercase text-sm">
                  {media.type === 'MOVIE'
                    ? 'Film'
                    : media.type === 'EPISODE'
                    ? 'Episodio'
                    : media.type}
                </span>
                {media.metadataSource === 'tmdb' && (
                  <span className="text-green-500 text-sm">✓ TMDB</span>
                )}
                {media.metadataSource === 'local' && (
                  <span className="text-blue-400 text-sm">✓ Locale</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`}>
                  {isAvailable ? '✅ Disponibile' : '❌ Non disponibile'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {media.revenue && media.revenue > 0 && (
                  <span className="text-gray-400 border rounded-lg text-sm font-medium">
                    💲 {formatRevenue(media.revenue)}
                  </span>
                )}
                {media.oscarAwards && media.oscarAwards > 0 && (
                  <span className="text-yellow-400 text-sm font-medium">
                    🏆 {media.oscarAwards} Oscar
                  </span>
                )}
              </div>

              {media.plot && (
                <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed max-w-2xl">
                  {media.plot}
                </p>
              )}

              {media.actors && Array.isArray(media.actors) && media.actors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white font-semibold mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {media.actors.slice(0, 6).map((actor: string) => (
                      <Link
                        key={actor}
                        to={`/actor/${encodeURIComponent(actor)}`}
                        className="bg-dark-700 text-gray-300 text-xs px-3 py-1 
                        rounded-full border border-transparent 
                        transition-all duration-200 hover:scale-105 
                        hover:bg-yellow-600 hover:text-black hover:border-white"
                      >
                        {actor}
                      </Link>
                    ))}
                    {media.actors.length > 6 && (
                      <span className="text-gray-500 text-xs px-3 py-1">
                        +{media.actors.length - 6} altri
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Regista: diretto per i film, ereditato dalla serie per gli episodi */}
              {(media.director || (isEpisode && media.series?.director)) && (
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">
                    Regia:{' '}
                    <span className="text-white">
                      {media.director || media.series?.director}
                    </span>
                  </span>
                </div>
              )}

              {!isAvailable && (
                <div className="mt-4 bg-red-900/70 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <strong className="block text-red-100">
                      {isEpisode ? 'Episodio non disponibile' : 'Film non disponibile'}
                    </strong>
                    <span className="text-sm text-red-200/80">
                      Il file video non è stato trovato sul disco. Verifica che il disco sia collegato e avvia una scansione.
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={handlePlay}
                  disabled={!isAvailable}
                  className={`px-8 py-3 font-bold rounded-lg flex items-center gap-2 text-lg transition-colors ${
                    isAvailable
                      ? 'bg-green-500 hover:bg-green-700 border hover:scale-105 text-white'
                      : 'bg-gray-600 cursor-not-allowed opacity-50 text-gray-300'
                  }`}
                >
                  {hasProgress ? '▶ Riprendi' : '▶ Play'}
                </button>

                {qualities.length > 0 && (
                  <select
                    value={selectedQuality || qualities[0]?.quality || ''}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    disabled={!isAvailable}
                    className={`bg-dark-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold ${
                      !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {qualities.map((q: any) => (
                      <option key={q.quality} value={q.quality}>
                        {qualityLabels[q.quality] || q.quality}
                      </option>
                    ))}
                  </select>
                )}

                <span className="text-gray-400 text-sm">
                  {qualities.length} qualità disponibili
                </span>

                {media.trailerUrl && (
                  <a
                    href={media.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    ▶ Trailer
                  </a>
                )}

                {/* 📝 Pulsante Modifica Metadati (solo MOVIE non-TMDB) */}
                {canEditMetadata && (
                  <button
                    onClick={() => setShowMetadataEditor((s) => !s)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2 border font-medium ${
                      showMetadataEditor
                        ? 'bg-red-800 text-white border-gray-500 hover:border-gray-200 hover:bg-red-900 hover:scale-90' 
                        : 'bg-black-800 hover:bg-gray-800 text-white border-dark-600 hover:border-yellow-400 hover:text-netflix-yellow'
                    }`}
                    title={
                      showMetadataEditor
                        ? 'Chiudi la scheda di modifica'
                        : 'Modifica manualmente i metadati di questo video'
                    }
                  >
                    {showMetadataEditor ? '✕ Chiudi scheda' : '✏️ Modifica Metadati'}
                  </button>
                )}
              </div>

              {/* 📝 SCHEDA MODIFICA METADATI (collassabile) */}
              {canEditMovieMetadata && showMetadataEditor && (
                <MetadataEditorForm
                  media={media}
                  onClose={() => setShowMetadataEditor(false)}
                  onSaved={() => {
                    setImageVersion(Date.now());
                    setShowMetadataEditor(false);
                  }}
                />
              )}

              {canEditEpisodeMetadata && showMetadataEditor && (
                <EpisodeMetadataEditorForm
                  episode={media}
                  onClose={() => setShowMetadataEditor(false)}
                  onSaved={() => {
                    setImageVersion(Date.now());
                    setShowMetadataEditor(false);
                  }}
                />
              )}

              {!isAvailable && (
                <p className="mt-3 text-xs text-gray-400">
                  💡 Suggerimento: collega il disco e avvia una nuova scansione dalla barra di navigazione.
                </p>
              )}
            </div>
          </div>
        </div>

        {showPlayer && isAvailable && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="relative w-full h-full">
              <VideoPlayer
                key={id}
                mediaId={media.id}
                className="w-full h-full"
                onClose={handleClosePlayer}
                initialProgress={progressData || 0}
                prevEpisode={episodeNav?.previous || null}
                nextEpisode={episodeNav?.next || null}
                onNavigateEpisode={handleNavigateEpisode}
                autoPlayNext={true}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}