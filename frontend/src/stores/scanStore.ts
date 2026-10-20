import { create } from 'zustand';

interface ScanStore {
  isScanning: boolean;
  startedAt: string | null;
  startScan: (startedAt?: string) => void;
  endScan: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  isScanning: false,
  startedAt: null,
  startScan: (startedAt) =>
    set({
      isScanning: true,
      startedAt: startedAt ?? new Date().toISOString(),
    }),
  endScan: () => set({ isScanning: false, startedAt: null }),
}));