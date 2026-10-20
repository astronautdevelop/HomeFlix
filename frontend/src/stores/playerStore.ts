import { create } from 'zustand';

interface Quality {
  quality: string;
  filePath: string;
  size: number;
  mimeType: string;
}

interface PlayerState {
  mediaId: string | null;
  title: string | null;
  qualities: Quality[];
  selectedQuality: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;

  setMedia: (mediaId: string, title: string, qualities: Quality[]) => void;
  setSelectedQuality: (quality: string) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  mediaId: null,
  title: null,
  qualities: [],
  selectedQuality: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isFullscreen: false,

  setMedia: (mediaId, title, qualities) => {
    // Seleziona automaticamente la qualità più alta disponibile
    const qualityOrder = ['4K', 'Full HD', 'HD', 'DVD', 'SD'];
    const sortedQualities = [...qualities].sort(
      (a, b) => qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality)
    );
    const selectedQuality = sortedQualities[0]?.quality || null;

    set({
      mediaId,
      title,
      qualities,
      selectedQuality,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
    });
  },

  setSelectedQuality: (quality) => set({ selectedQuality: quality }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

  reset: () =>
    set({
      mediaId: null,
      title: null,
      qualities: [],
      selectedQuality: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      isFullscreen: false,
    }),
}));