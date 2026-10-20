import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationManagerGateway } from './notification-manager.gateway';

export type NotificationType = 
| 'info' 
| 'success' 
| 'warning' 
| 'error' 
| 'special' 
| 'detail';

export interface Notification {
  id?: string;
  type: NotificationType;
  message: string;
  details?: any;
  createdAt?: Date;
  read?: boolean;
}

@Injectable()
export class NotificationManagerService implements OnModuleInit {
  private readonly logger = new Logger(NotificationManagerService.name);
  private readonly MAX_LOGS = 1000;
  private readonly TTL_DAYS = 7;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private gateway: NotificationManagerGateway,
  ) {}

  async onModuleInit() {
    await this.cleanupOldLogs();
    setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000);
  }

  async notify(type: NotificationType, message: string, details?: any): Promise<Notification> {
    const notification: Notification = {
      type,
      message,
      details,
      createdAt: new Date(),
      read: false,
    };

    const saved = await this.prisma.notificationLog.create({
      data: {
        type: notification.type,
        message: notification.message,
        details: notification.details || {},
        createdAt: notification.createdAt,
        read: notification.read,
        ttl: new Date(Date.now() + this.TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    notification.id = saved.id;

    this.eventEmitter.emit('notification.new', notification);
    this.gateway.broadcastNotification(notification);
    this.logger.log(`[${type.toUpperCase()}] ${message}`);

    await this.enforceMaxLogs();

    return notification;
  }

  // CORREZIONE: mappiamo i campi del DB al tipo Notification
  async getRecentLogs(limit: number = 50): Promise<Notification[]> {
    const logs = await this.prisma.notificationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log) => ({
      id: log.id,
      type: log.type as NotificationType, // cast al tipo corretto
      message: log.message,
      details: log.details,
      createdAt: log.createdAt,
      read: log.read,
    }));
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notificationLog.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(): Promise<void> {
    await this.prisma.notificationLog.updateMany({
      data: { read: true },
    });
  }

  private async cleanupOldLogs(): Promise<void> {
    const cutoff = new Date(Date.now() - this.TTL_DAYS * 24 * 60 * 60 * 1000);
    await this.prisma.notificationLog.deleteMany({
      where: {
        OR: [{ createdAt: { lt: cutoff } }, { ttl: { lt: new Date() } }],
      },
    });
    this.logger.log('Pulizia log vecchi completata');
  }

  private async enforceMaxLogs(): Promise<void> {
    const count = await this.prisma.notificationLog.count();
    if (count > this.MAX_LOGS) {
      const toDelete = count - this.MAX_LOGS;
      const oldest = await this.prisma.notificationLog.findMany({
        orderBy: { createdAt: 'asc' },
        take: toDelete,
        select: { id: true },
      });
      const ids = oldest.map((l) => l.id);
      await this.prisma.notificationLog.deleteMany({
        where: { id: { in: ids } },
      });
      this.logger.log(`Eliminati ${toDelete} log vecchi (limite ${this.MAX_LOGS})`);
    }
  }
}