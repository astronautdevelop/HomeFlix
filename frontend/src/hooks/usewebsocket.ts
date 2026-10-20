import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService } from '../services/websocket';
import { useScanStore } from '../stores/scanStore';

export function useWebSocket() {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);

  // 🔥 Scansione avviata (da questo client o da un altro)
  const handleScanStarted = useCallback((data: any) => {
    console.log('📡 Scansione avviata', data);
    useScanStore.getState().startScan(data?.startedAt);
  }, []);

  const handleScanCompleted = useCallback((data: any) => {
    console.log('📡 Scansione completata, aggiorno la libreria...', data);

    // 🔥 Ferma l'animazione della barra
    useScanStore.getState().endScan();

    queryClient.invalidateQueries({ queryKey: ['media'] });
    queryClient.invalidateQueries({ queryKey: ['genres'] });
    queryClient.invalidateQueries({ queryKey: ['seasons'] });
    queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
    queryClient.invalidateQueries({ queryKey: ['collections'] });
    queryClient.invalidateQueries({ queryKey: ['statistics'] });
    queryClient.invalidateQueries({ queryKey: ['health-check'] });
    queryClient.invalidateQueries({ queryKey: ['metadata-status'] });
  }, [queryClient]);

  const handleNotification = useCallback((data: any) => {
    console.log('🔔 Notifica ricevuta:', data);

    if (data?.details?.mediaId) {
      queryClient.invalidateQueries({ queryKey: ['media', data.details.mediaId] });
    }

    if (data?.type === 'success') {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    }
  }, [queryClient]);

  useEffect(() => {
    wsService.connect();

    wsService.on('scan-started', handleScanStarted);
    wsService.on('scan-completed', handleScanCompleted);
    wsService.on('notification', handleNotification);

    isConnected.current = true;

    return () => {
      wsService.off('scan-started', handleScanStarted);
      wsService.off('scan-completed', handleScanCompleted);
      wsService.off('notification', handleNotification);
    };
  }, [handleScanStarted, handleScanCompleted, handleNotification]);
}