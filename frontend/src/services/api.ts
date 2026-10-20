import axios, { AxiosError } from 'axios';
import { useNotificationStore } from '@/stores/notificationStore';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s timeout di default
});

// ============================================================
// 🔴 INTERCEPTOR ERRORI → NOTIFICHE ROSSE
// ============================================================

// Deduplicazione: chiave errore → timestamp ultima notifica
const recentErrors = new Map<string, number>();
const DEDUP_WINDOW_MS = 3000;

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getErrorKey(error: AxiosError): string {
  if (error.code === 'ERR_NETWORK') return 'network';
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return 'timeout';
  if (error.response) {
    // 🔥 Non includo l'URL: tutti gli errori 500 (o 404, ecc.) condividono
    //    la stessa chiave, così non generano notifiche multiple
    return `http_${error.response.status}`;
  }
  return 'unknown';
}

function buildErrorMessage(error: AxiosError): { message: string } {
  if (error.code === 'ERR_NETWORK') {
    return { message: 'Server non raggiungibile' };
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return { message: 'Timeout della richiesta' };
  }

  const status = error.response?.status;
  const serverMessage = (error.response?.data as any)?.message;

  switch (status) {
    case 400:
      return { message: serverMessage || 'Richiesta non valida' };
    case 401:
      return { message: 'Non autorizzato' };
    case 403:
      return { message: 'Accesso negato' };
    case 404:
      return { message: 'Risorsa non trovata' };
    case 500:
      return { message: 'Errore interno del server' };
    case 502:
    case 503:
    case 504:
      return { message: 'Server temporaneamente non disponibile' };
    default:
      return { message: serverMessage || `Errore di rete` };
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Ignora richieste cancellate (es. React Query cancellations)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const key = getErrorKey(error);
    const now = Date.now();
    const last = recentErrors.get(key);

    // Deduplicazione: se la stessa tipologia di errore è stata notificata
    // negli ultimi 3 secondi, la salto
    if (last && now - last < DEDUP_WINDOW_MS) {
      return Promise.reject(error);
    }
    recentErrors.set(key, now);
    setTimeout(() => recentErrors.delete(key), DEDUP_WINDOW_MS);

    const { message } = buildErrorMessage(error);

    try {
      useNotificationStore.getState().addNotification({
        id: generateId(),
        type: 'error',
        message,
        createdAt: new Date(),
        read: false,
      });
    } catch (notifyError) {
      console.error('Errore invio notifica:', notifyError);
    }

    return Promise.reject(error);
  },
);

// ===== MEDIA =====
export const getMedia = () => api.get('/media');
export const getMediaById = (id: string) => api.get(`/media/${id}`);

// ===== LIBRARY =====
export const scanLibrary = () => api.post('/library/scan');
export const getScanStatus = () => api.get('/library/scan/status');

// ===== METADATA =====
export const updateMetadata = (mediaId: string) => api.post(`/metadata/update/${mediaId}`);
export const updateAllMetadata = () => api.post('/metadata/update-all');
export const getMetadataStatus = () => api.get('/metadata/status');

// ===== PLAYER - NAVIGAZIONE EPISODI =====
export const getMediaInfo = (mediaId: string) => api.get(`/player/info/${mediaId}`);
export const getQualities = (mediaId: string) => api.get(`/player/qualities/${mediaId}`);
export const getPlayUrl = (mediaId: string, quality?: string) =>
  `/api/player/play/${mediaId}${quality ? `?quality=${quality}` : ''}`;
export const getEpisodeNav = (
  mediaId: string,
): Promise<{
  previous: EpisodeNavItem | null;
  next: EpisodeNavItem | null;
}> => api.get(`/player/episode-nav/${mediaId}`).then((res) => res.data);

export interface EpisodeNavItem {
  id: string;
  title: string;
  originalTitle: string | null;
  episodeNumber: number | null;
  seasonNumber: number | null;
  seasonId: string | null;
  seriesTitle: string | null;
}

// ===== PROGRESS & CONTINUE WATCHING =====
export const saveProgress = (mediaId: string, progress: number, quality?: string, duration?: number) =>
  api.post('/player/progress', { mediaId, progress, quality, duration });

export const getContinueWatching = () =>
  api.get('/player/continue-watching').then((res) => res.data);

export const getProgress = (mediaId: string) =>
  api.get(`/player/progress/${mediaId}`).then((res) => res.data.progress);

// ===== NOTIFICATIONS =====
export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (id: string) => api.patch(`/notifications/read/${id}`);
export const markAllNotificationsAsRead = () => api.patch('/notifications/read-all');

// ===== RANDOM FILM =====
export const getRandomMedia = async () => {
  const response = await api.get('/media/random');
  return response.data;
};

// ===== ACTOR =====
export const getActorDetails = (name: string) =>
  api.get(`/actor/${encodeURIComponent(name)}/details`).then((res) => res.data);

export const getActorMovies = (name: string) =>
  api.get(`/actor/${encodeURIComponent(name)}/movies`).then((res) => res.data);

export const getActorImage = (name: string) =>
  `/api/actor/${encodeURIComponent(name)}/image`;

// ===== SETTINGS =====
export const getSettings = () => api.get('/settings').then((res) => res.data);

export const updateSettings = (data: { tmdbApiKey?: string; mediaRoots?: string[] }) =>
  api.put('/settings', data).then((res) => res.data);

export const getDiskSpace = () => api.get('/settings/disk-space').then((res) => res.data);

/**
 * 🔑 Valida una chiave API TMDB senza salvarla.
 * Ritorna: { valid: boolean, message: string }
 */
export const validateTmdbKey = (key: string): Promise<{ valid: boolean; message: string }> =>
  api.post('/settings/validate-tmdb-key', { key }).then((res) => res.data);

// ===== COLLECTIONS =====
export const getCollections = () => api.get('/collections');
export const getCollection = (id: string) => api.get(`/collections/${id}`);
export const createCollection = (data: any) => api.post('/collections', data);
export const updateCollection = (id: string, data: any) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id: string) => api.delete(`/collections/${id}`);
export const addMediaToCollection = (collectionId: string, mediaId: string) =>
  api.post(`/collections/${collectionId}/media`, { mediaId });
export const removeMediaFromCollection = (collectionId: string, mediaId: string) =>
  api.delete(`/collections/${collectionId}/media/${mediaId}`);
export const updateCollectionOrder = (collectionId: string, mediaIds: string[]) =>
  api.put(`/collections/${collectionId}/order`, { mediaIds });
export const getAvailableMediaForCollection = (collectionId: string) =>
  api.get(`/collections/${collectionId}/media/available`);
export const getAllCollectionsWithMedia = () =>
  api.get('/collections/detailed/all');

// ===== STATISTICS =====
export const getStatistics = () => api.get('/statistics').then((res) => res.data);
export const resetStatistics = () =>
  api.delete('/statistics').then((res) => res.data);

// ===== SERIE TV =====
export const getSeasons = () =>
  api.get('/media/seasons').then((res) => res.data);

export const getSeasonDetails = (seasonId: string) =>
  api.get(`/media/seasons/${seasonId}`).then((res) => res.data);

export const getSeriesImage = (seriesId: string, type: 'poster' | 'background' = 'poster') =>
  `/api/media/series/${seriesId}/image?type=${type}`;

// ===== CONTINUE WATCHING ARRICCHITO =====
export const getContinueWatchingEnriched = () =>
  api.get('/media/continue-watching').then((res) => res.data);

// ===== UPLOAD =====
export const uploadCollectionImage = (
  collectionId: string,
  file: File,
  type: 'poster' | 'background' = 'poster',
) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/collections/${collectionId}/upload?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============================================================
// ===== MEDIA METADATA (scheda "Modifica Metadati") =====
// ============================================================

export interface UpdateMediaMetadataDto {
  title: string;
  originalTitle?: string;
  plot?: string;
  runtime?: number;
  releaseYear?: number;
  genres?: string[];
  actors?: string[];
  director?: string;
  country?: string;
  language?: string;
  revenue?: number;
  oscarAwards?: number;
  rating?: number;
  trailerUrl?: string;
  logoUrl?: string;
}

/** 💾 Salva i campi testuali dei metadati (PATCH /media/:id/metadata) */
export const updateMediaMetadata = (id: string, dto: UpdateMediaMetadataDto) =>
  api.patch(`/media/${id}/metadata`, dto).then((res) => res.data);

/** 🖼️ Carica il poster personalizzato (multipart) */
export const uploadMediaPoster = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api
    .post(`/media/${id}/metadata/poster`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

/** 🖼️ Carica il background personalizzato (multipart) */
export const uploadMediaBackground = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api
    .post(`/media/${id}/metadata/background`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

/**
 * 🖼️ Costruisce l'URL dell'immagine per il frontend, con cache-busting opzionale.
 *    Passare `cacheBuster` (es. un timestamp) forza il reload dell'immagine
 *    anche se l'URL di base non è cambiato.
 */
export const getMediaImageUrl = (
  id: string,
  type: 'poster' | 'background',
  cacheBuster?: string | number | null,
) => {
  const base = `/api/media/image/${id}?type=${type}`;
  if (cacheBuster === undefined || cacheBuster === null || cacheBuster === '') {
    return base;
  }
  return `${base}&v=${encodeURIComponent(String(cacheBuster))}`;
};

// ============================================================
// ===== SERIE — METADATA EDITOR =====
// ============================================================

export interface UpdateSeriesMetadataDto {
  title: string;
  originalTitle?: string;
  plot?: string;
  genres?: string[];
  actors?: string[];
  country?: string;
  language?: string;
  rating?: number;
  releaseYear?: number;
  runtime?: number;
}

/** 💾 Salva i metadati testuali di una Serie personale */
export const updateSeriesMetadata = (seriesId: string, dto: UpdateSeriesMetadataDto) =>
  api.patch(`/media/series/${seriesId}/metadata`, dto).then((res) => res.data);

/** 🖼️ Carica il poster della Serie (propaga a tutti gli episodi) */
export const uploadSeriesPoster = (seriesId: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api
    .post(`/media/series/${seriesId}/metadata/poster`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

/** 🖼️ Carica il background della Serie */
export const uploadSeriesBackground = (seriesId: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api
    .post(`/media/series/${seriesId}/metadata/background`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

// ============================================================
// ===== EPISODI — METADATA EDITOR =====
// ============================================================

export interface UpdateEpisodeMetadataDto {
  title: string;
  originalTitle?: string;
  plot?: string;
  rating?: number;
  runtime?: number;
  country?: string;
}

/** 💾 Salva i metadati testuali di un Episodio personale */
export const updateEpisodeMetadata = (id: string, dto: UpdateEpisodeMetadataDto) =>
  api.patch(`/media/episodes/${id}/metadata`, dto).then((res) => res.data);

/** 🖼️ Carica il background (still) dell'episodio */
export const uploadEpisodeBackground = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return api
    .post(`/media/episodes/${id}/metadata/background`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};