import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const OFFLINE_MESSAGE = 'Connessione a internet assente';
const ONLINE_MESSAGE = 'Connesso a internet';

/**
 * 🔵 Ascolta gli eventi online/offline del browser e genera notifiche speciali.
 * - Non emette nulla all'avvio (evita spam ad ogni apertura pagina).
 * - Emette "assente" alla perdita di connessione.
 * - Emette "connesso" solo se prima eravamo offline.
 */
export function useNetworkStatus() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const wasOffline = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      // Se non eravamo offline, ignora (evita notifica all'avvio)
      if (!wasOffline.current) return;
      wasOffline.current = false;

      // Rimuovi eventuali notifiche "assente" ancora visibili
      const existing = useNotificationStore.getState().notifications;
      existing.forEach((n) => {
        if (n.type === 'special' && n.message === OFFLINE_MESSAGE) {
          removeNotification(n.id);
        }
      });

      addNotification({
        id: generateId(),
        type: 'special',
        message: ONLINE_MESSAGE,
        createdAt: new Date(),
        read: false,
      });
    };

    const handleOffline = () => {
      wasOffline.current = true;

      // Evita duplicati (già gestito dallo store, ma double-check)
      const existing = useNotificationStore.getState().notifications;
      if (
        existing.some(
          (n) => n.type === 'special' && n.message === OFFLINE_MESSAGE,
        )
      ) {
        return;
      }

      addNotification({
        id: generateId(),
        type: 'special',
        message: OFFLINE_MESSAGE,
        createdAt: new Date(),
        read: false,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification, removeNotification]);
}