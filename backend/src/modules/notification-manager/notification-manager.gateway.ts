import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Notification } from './notification-manager.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 🔥 Metodo per emettere eventi personalizzati
  emitEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  // 🔥 Evento di inizio scansione
  emitScanStarted(data: any) {
    this.server.emit('scan-started', data);
  }

  // 🔥 Evento di fine scansione
  emitScanCompleted(data: any) {
    this.server.emit('scan-completed', data);
  }

  private readonly logger = new Logger(NotificationManagerGateway.name);
  private clients: Set<string> = new Set();

  handleConnection(client: Socket) {
    this.clients.add(client.id);
    this.logger.log(`Client connesso: ${client.id} (${this.clients.size} connessi)`);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.logger.log(`Client disconnesso: ${client.id} (${this.clients.size} connessi)`);
  }

  broadcastNotification(notification: Notification) {
    this.server.emit('notification', notification);
    this.logger.log(`Notifica broadcast: ${notification.message}`);
  }
}