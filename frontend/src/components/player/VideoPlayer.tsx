// src/components/player/VideoPlayer.tsx (COMPLETO)

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPlayUrl, getQualities, saveProgress } from '@/services/api';
import { usePlayerStore } from '@/stores/playerStore';

export interface NavEpisode {
  id: string;
  episodeNumber: number | null;
  seasonNumber: number | null;
  seasonId: string | null;
  seriesTitle: string | null;
  title: string;
}

interface VideoPlayerProps {
  mediaId: string;
  className?: string;
  onClose?: () => void;
  initialProgress?: number;
  // 🔥 Navigazione episodi (solo per EPISODE)
  prevEpisode?: NavEpisode | null;
  nextEpisode?: NavEpisode | null;
  onNavigateEpisode?: (episodeId: string) => void;
  autoPlayNext?: boolean;
}

export function VideoPlayer({
  mediaId,
  className = '',
  onClose,
  initialProgress = 0,
  prevEpisode = null,
  nextEpisode = null,
  onNavigateEpisode,
  autoPlayNext = true,
}: VideoPlayerProps) {
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { selectedQuality, setSelectedQuality } = usePlayerStore();

  const selectedQualityRef = useRef(selectedQuality);
  const durationRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastSavedProgress = useRef(0);
  const pendingSeekRef = useRef<number | null>(null);
  const navigatedRef = useRef(false); // evita doppio trigger in onEnded

  const [qualities, setQualities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    selectedQualityRef.current = selectedQuality;
  }, [selectedQuality]);

  // Carica le qualità
  useEffect(() => {
    getQualities(mediaId)
      .then((res) => {
        setQualities(res.data);
        if (!selectedQuality && res.data.length > 0) {
          const order = ['4K', 'Full HD', 'HD', 'DVD', 'SD'];
          const sorted = [...res.data].sort((a, b) => order.indexOf(a.quality) - order.indexOf(b.quality));
          setSelectedQuality(sorted[0]?.quality || '');
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, [mediaId, selectedQuality, setSelectedQuality]);

  // Salvataggio progresso
  const saveCurrentProgress = useCallback(
    async (progress: number, duration: number) => {
      if (progress <= 0 || duration <= 0) return;

      try {
        await saveProgress(mediaId, progress, selectedQualityRef.current || undefined, duration);
        lastSavedProgress.current = progress;
        queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
        queryClient.invalidateQueries({ queryKey: ['progress', mediaId] });
      } catch (err) {
        console.error('Errore salvataggio progresso:', err);
      }
    },
    [mediaId, queryClient],
  );

  // Timeupdate
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    currentProgressRef.current = currentTime;
    durationRef.current = duration;

    if (duration > 0 && currentTime > 0 && !video.paused) {
      if (!saveIntervalRef.current) {
        saveIntervalRef.current = setInterval(() => {
          const videoEl = videoRef.current;
          if (videoEl && !videoEl.paused) {
            const current = videoEl.currentTime;
            const dur = videoEl.duration;
            if (Math.abs(current - lastSavedProgress.current) >= 2) {
              saveCurrentProgress(current, dur);
            }
          }
        }, 5000);
      }
    }
  }, [saveCurrentProgress]);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    currentProgressRef.current = currentTime;
    durationRef.current = duration;

    if (currentTime > 0) {
      saveCurrentProgress(currentTime, duration);
    }

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, [saveCurrentProgress]);

  // 🔥 onEnded — salva progresso e (se richiesto) va all'episodio successivo
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    if (duration > 0) {
      // Salva il 100% (verrà poi rimosso dal backend perché fuori soglia 2-85%,
      // così l'episodio non resta in "Continua a guardare")
      saveCurrentProgress(duration, duration);
    }

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    // Autoplay prossimo episodio
    if (autoPlayNext && nextEpisode && onNavigateEpisode && !navigatedRef.current) {
      navigatedRef.current = true;
      // Piccolo delay per lasciar completare la richiesta di salvataggio progresso
      setTimeout(() => {
        onNavigateEpisode(nextEpisode.id);
      }, 600);
    }
  }, [saveCurrentProgress, autoPlayNext, nextEpisode, onNavigateEpisode]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    durationRef.current = video.duration;

    if (pendingSeekRef.current !== null) {
      video.currentTime = pendingSeekRef.current;
      pendingSeekRef.current = null;
    }
  }, []);

  // Progresso iniziale
  useEffect(() => {
    if (initialProgress > 0) {
      const video = videoRef.current;
      if (video && video.readyState >= 1) {
        video.currentTime = initialProgress;
      } else {
        pendingSeekRef.current = initialProgress;
      }
    }
  }, [initialProgress]);

  // Reset flag navigazione quando cambia mediaId (nuovo episodio)
  useEffect(() => {
    navigatedRef.current = false;
    setIsLoading(true);
    lastSavedProgress.current = 0;
    currentProgressRef.current = 0;
  }, [mediaId]);

  // Cleanup allo smontaggio
  useEffect(() => {
    return () => {
      // Se stiamo navigando volontariamente al prossimo episodio,
      // NON risalvare il progresso (è già stato salvato al 100% da handleEnded)
      const progress = currentProgressRef.current;
      const duration = durationRef.current;

      if (!navigatedRef.current && progress > 0 && duration > 0) {
        saveCurrentProgress(progress, duration).catch(() => {});
      }

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    };
  }, [saveCurrentProgress]);

  const handleClose = useCallback(() => {
    const video = videoRef.current;
    if (video && video.currentTime > 0 && video.duration > 0) {
      saveCurrentProgress(video.currentTime, video.duration).finally(() => {
        onClose?.();
      });
    } else {
      onClose?.();
    }
  }, [onClose, saveCurrentProgress]);

  // 🔥 Pulsanti prev/next
  const handlePrev = useCallback(() => {
    if (!prevEpisode || !onNavigateEpisode) return;
    navigatedRef.current = true; // evita autoplay indesiderato / doppio salvataggio
    const video = videoRef.current;
    if (video && video.currentTime > 0 && video.duration > 0) {
      saveCurrentProgress(video.currentTime, video.duration).finally(() => {
        onNavigateEpisode(prevEpisode.id);
      });
    } else {
      onNavigateEpisode(prevEpisode.id);
    }
  }, [prevEpisode, onNavigateEpisode, saveCurrentProgress]);

  const handleNext = useCallback(() => {
    if (!nextEpisode || !onNavigateEpisode) return;
    navigatedRef.current = true;
    const video = videoRef.current;
    if (video && video.currentTime > 0 && video.duration > 0) {
      saveCurrentProgress(video.currentTime, video.duration).finally(() => {
        onNavigateEpisode(nextEpisode.id);
      });
    } else {
      onNavigateEpisode(nextEpisode.id);
    }
  }, [nextEpisode, onNavigateEpisode, saveCurrentProgress]);

  const videoSrc = getPlayUrl(mediaId, selectedQuality || undefined);

  const qualityLabels: Record<string, string> = {
    '4K': '4K Ultra HD',
    'Full HD': 'Full HD 1080p',
    HD: 'HD 720p',
    DVD: 'DVD 480p',
    SD: 'Standard Definition',
  };

  const mimeType = videoSrc.includes('.mkv') ? 'video/x-matroska' : 'video/mp4';

  const formatEpLabel = (ep: NavEpisode | null) => {
    if (!ep) return '';
    const s = ep.seasonNumber != null ? `S${String(ep.seasonNumber).padStart(2, '0')}` : 'S?';
    const e = ep.episodeNumber != null ? `E${String(ep.episodeNumber).padStart(2, '0')}` : 'E?';
    return `${s}${e}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Caricamento video...</p>
        </div>
      </div>
    );
  }

  const showNavButtons = (prevEpisode || nextEpisode) && onNavigateEpisode;

  return (
    <div className={`relative bg-black ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={videoSrc} type={mimeType} />
      </video>

      {/* 🔥 Barra comandi in alto a destra: qualità + prev/next */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {qualities.length > 1 && (
          <select
            value={selectedQuality || ''}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="bg-black/70 hover:bg-black/90 text-white text-sm border border-gray-600 rounded-lg px-3 py-1.5 cursor-pointer"
          >
            {qualities.map((q) => (
              <option key={q.quality} value={q.quality}>
                {qualityLabels[q.quality] || q.quality}
              </option>
            ))}
          </select>
        )}

        {showNavButtons && (
          <>
            <button
              onClick={handlePrev}
              disabled={!prevEpisode}
              title={
                prevEpisode
                  ? `Precedente: ${formatEpLabel(prevEpisode)}${prevEpisode.title ? ` · ${prevEpisode.title}` : ''}`
                  : 'Nessun episodio precedente'
              }
              className={`text-white text-sm border rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                prevEpisode
                  ? 'bg-black/70 hover:bg-black/90 border-gray-600 cursor-pointer'
                  : 'bg-black/40 border-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-base leading-none">⏮</span>
              {prevEpisode ? formatEpLabel(prevEpisode) : 'Prec'}
            </button>

            <button
              onClick={handleNext}
              disabled={!nextEpisode}
              title={
                nextEpisode
                  ? `Successivo: ${formatEpLabel(nextEpisode)}${nextEpisode.title ? ` · ${nextEpisode.title}` : ''}`
                  : 'Nessun episodio successivo'
              }
              className={`text-white text-sm border rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                nextEpisode
                  ? 'bg-black/70 hover:bg-black/90 border-gray-600 cursor-pointer'
                  : 'bg-black/40 border-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {nextEpisode ? formatEpLabel(nextEpisode) : 'Succ'}
              <span className="text-base leading-none">⏭</span>
            </button>
          </>
        )}
      </div>

      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 text-xl"
        >
          ✕
        </button>
      )}
    </div>
  );
}