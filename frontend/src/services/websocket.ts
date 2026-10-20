import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        // 🔥 Socket.IO mantiene AUTOMATICAMENTE i listener attraverso le
        //    riconnessioni. NON ri-registrare qui i callback dall'array,
        //    altrimenti si duplicano ad ogni riconnessione.
        console.log('🔗 WebSocket connesso');
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 WebSocket disconnesso');
      });

      this.socket.on('connect_error', (err) => {
        console.error('❌ Errore connessione WebSocket:', err);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const callbacks = this.listeners.get(event)!;
    // 🔥 Evita doppia registrazione dello stesso callback
    if (callbacks.includes(callback)) return;
    callbacks.push(callback);
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const filtered = callbacks.filter((cb) => cb !== callback);
      this.listeners.set(event, filtered);
      this.socket?.off(event, callback);
    } else {
      // 🔥 Rimuove tutti i listener per quell'evento
      const callbacks = this.listeners.get(event) || [];
      for (const cb of callbacks) {
        this.socket?.off(event, cb);
      }
      this.listeners.delete(event);
    }
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }
}

export const wsService = new WebSocketService();