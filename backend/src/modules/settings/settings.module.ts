import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { StorageManagerModule } from '../storage-manager/storage-manager.module';
import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [CoreModule, PrismaModule, StorageManagerModule, NotificationManagerModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService], // così altri moduli possono usarlo se necessario
})
export class SettingsModule {}