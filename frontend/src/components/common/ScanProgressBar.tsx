// src/components/common/ScanProgressBar.tsx
import { useScanStore } from '@/stores/scanStore';

export function ScanProgressBar() {
  const isScanning = useScanStore((s) => s.isScanning);

  if (!isScanning) return null;

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 bottom-0 h-[3px] overflow-hidden"
      aria-hidden="true"
    >
      <div className="scan-progress-bar" />
    </div>
  );
}