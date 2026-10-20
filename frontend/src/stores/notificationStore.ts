import { create } from 'zustand';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'special'
  | 'detail';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  details?: any;
  createdAt: Date;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

// ⏱️ Durata auto-dismiss (solo per i tipi che si chiudono da soli)
const NOTIFICATION_DURATION = 4000;

// ✅ Tipi che si chiudono automaticamente (success + warning)
const AUTO_DISMISS_TYPES: NotificationType[] = ['success', 'warning'];

function isAutoDismiss(type: NotificationType): boolean {
  return AUTO_DISMISS_TYPES.includes(type);
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

addNotification: (notification) => {
    // 🔥 Guard: se una notifica con lo stesso ID è già presente, ignora
    if (get().notifications.some((n) => n.id === notification.id)) {
      return;
    }

    if (
      get().notifications.some(
        (n) =>
          n.type === notification.type &&
          n.message === notification.message,
      )
    ) {
      return;
    }

    const notificationWithDate: Notification = {
      ...notification,
      createdAt: notification.createdAt ?? new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [notificationWithDate, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // ⏱️ Auto-dismiss solo per i tipi "temporanei"
    if (isAutoDismiss(notificationWithDate.type)) {
      setTimeout(() => {
        get().removeNotification(notificationWithDate.id);
      }, NOTIFICATION_DURATION);
    }
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notification?.read
        ? state.unreadCount
        : state.unreadCount - 1;
      return {
        notifications: newNotifications,
        unreadCount: Math.max(0, unreadCount),
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = newNotifications.filter((n) => !n.read).length;
      return {
        notifications: newNotifications,
        unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },
}));