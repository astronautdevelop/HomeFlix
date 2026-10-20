import { Module } from '@nestjs/common';
import { NotificationManagerService } from './notification-manager.service';
import { NotificationManagerGateway } from './notification-manager.gateway';
import { NotificationManagerController } from './notification-manager.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    NotificationManagerService,
    NotificationManagerGateway
  ],
  controllers: [NotificationManagerController],
  exports: [NotificationManagerService, NotificationManagerGateway], // <-- È FONDAMENTALE
})
export class NotificationManagerModule {}