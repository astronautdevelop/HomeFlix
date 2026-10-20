import { useEffect, useRef } from 'react';
import {
  useNotificationStore,
  type NotificationType,
} from '@/stores/notificationStore';
import { wsService } from '@/services/websocket';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Configurazione visiva per ogni tipo di notifica.
 */
const typeConfig: Record<
  NotificationType,
  {
    bg: string;
    text: string;
    closeBtn: string;
    icon: string;
    autoDismiss: boolean;
  }
> = {
  // 🟢 Successo (auto-dismiss)
  success: {
    bg: 'bg-green-600 border-green-400/40',
    text: 'text-white',
    closeBtn: 'text-white/70 hover:text-white',
    icon: '✅',
    autoDismiss: true,
  },
  // 🟡 Avvertimento (auto-dismiss)
  warning: {
    bg: 'bg-yellow-600 border-yellow-400/40',
    text: 'text-white',
    closeBtn: 'text-white/70 hover:text-white',
    icon: '⚠️',
    autoDismiss: true,
  },
  // 🔴 Errore (persistente)
  error: {
    bg: 'bg-red-700 border-red-400/40',
    text: 'text-white',
    closeBtn: 'text-white/70 hover:text-white',
    icon: '❌',
    autoDismiss: false,
  },
  // 🔵 Speciale (persistente)
  special: {
    bg: 'bg-blue-600 border-blue-400/40',
    text: 'text-white',
    closeBtn: 'text-white/70 hover:text-white',
    icon: 'ℹ️',
    autoDismiss: false,
  },
  // ⚪ Dettaglio (persistente) - sfondo bianco, testo nero
  detail: {
    bg: 'bg-white border-gray-300',
    text: 'text-gray-900',
    closeBtn: 'text-gray-500 hover:text-gray-900',
    icon: '📋',
    autoDismiss: false,
  },
  // ℹ️ Info generico → mappato su bianco (dettaglio)
  info: {
    bg: 'bg-white border-gray-300',
    text: 'text-gray-900',
    closeBtn: 'text-gray-500 hover:text-gray-900',
    icon: 'ℹ️',
    autoDismiss: false,
  },
};

/**
 * Genera un ID univoco robusto, senza collisioni anche se due
 * notifiche arrivano nello stesso millisecondo.
 */
function generateNotificationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Etichette italiane per i campi oggetto più comuni ricevuti dal backend.
 * Usato SOLO dalla notifica "detail" (lista verticale).
 */
const DETAIL_LABELS: Record<string, string> = {
  added: 'Aggiunti',
  removed: 'Rimossi',
  updated: 'Aggiornati',
  errors: 'Errori',
  unavailable: 'Non disponibili',
  available: 'Disponibili',
  total: 'Totale',
  success: 'Successo',
  failed: 'Falliti',
  scanned: 'Scansionati',
  missing: 'Mancanti',
  files: 'File',
  duplicates: 'Duplicati',
  brokenFiles: 'File rotti',
  movies: 'Film',
  series: 'Serie',
  episodes: 'Episodi',
};

/**
 * ⚪ Renderizza i dettagli come LISTA VERTICALE (solo per notifiche "detail").
 * Mostra solo sezioni che contengono array non vuoti.
 * Ignora completamente campi tecnici (mediaId, type, ecc.).
 */
function renderDetailSections(details: any) {
  if (!details || typeof details !== 'object') return null;

  const sections: { label: string; items: string[] }[] = [];

  for (const [key, value] of Object.entries(details)) {
    // Mostra solo array (liste di elementi)
    if (!Array.isArray(value) || value.length === 0) continue;

    const label = DETAIL_LABELS[key] || key;
    const items = value
      .map((v: any) =>
        typeof v === 'string' ? v : v?.title || v?.name || JSON.stringify(v),
      )
      .filter(Boolean);

    if (items.length > 0) {
      sections.push({ label, items });
    }
  }

  if (sections.length === 0) return null;

  return (
    <div className="mt-2 space-y-3">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {section.label} ({section.items.length})
          </p>
          <ul className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
            {section.items.map((item, i) => (
              <li
                key={`${section.label}-${i}`}
                className="text-xs text-gray-800 pl-3 relative break-words"
              >
                <span className="absolute left-0 text-gray-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function NotificationToast() {
  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // 🔵 Ascolta connessione/assenza internet (notifiche blu)
  useNetworkStatus();

  const processedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    wsService.connect();

    const handleNotification = (data: any) => {
      const id = data.id || generateNotificationId();

      if (processedIds.current.has(id)) {
        return;
      }
      processedIds.current.add(id);

      addNotification({
        ...data,
        id,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        read: data.read ?? false,
      });

      setTimeout(() => {
        processedIds.current.delete(id);
      }, 6000);
    };

    wsService.on('notification', handleNotification);

    return () => {
      wsService.off('notification', handleNotification);
    };
  }, [addNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2 max-w-md w-full pointer-events-none">
      {notifications.map((notification) => {
        const config = typeConfig[notification.type] || typeConfig.info;
        const isDetail =
          notification.type === 'detail' || notification.type === 'info';

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto ${config.bg} ${config.text} p-4 rounded-lg shadow-2xl transform transition-all duration-300 animate-slide-in border backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm break-words">
                  {notification.message}
                </p>

                {/* ⚪ Solo per la notifica "detail" mostriamo la lista verticale.
                    Per tutte le altre: solo il messaggio pulito, niente details. */}
                {isDetail && renderDetailSections(notification.details)}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`${config.closeBtn} transition-colors flex-shrink-0 text-base font-bold`}
                aria-label="Chiudi notifica"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}