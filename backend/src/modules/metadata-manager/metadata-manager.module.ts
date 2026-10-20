import { Module } from '@nestjs/common';
import { MetadataManagerService } from './metadata-manager.service';
import { MetadataManagerController } from './metadata-manager.controller';
import { ActorCacheService } from './actor-cache.service';
import { StorageManagerModule } from '../storage-manager/storage-manager.module';
import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [
    StorageManagerModule,
    NotificationManagerModule,
    PrismaModule,
    CoreModule,
  ],
  providers: [
    MetadataManagerService,
    ActorCacheService,
    // ❌ RIMOSSI: PrismaService, CoreService
    // Erano istanze LOCALI: rompevano la condivisione dello stato
    // (chiave TMDB, mediaRoots, cache paths) con SettingsService.
  ],
  controllers: [MetadataManagerController],
  exports: [MetadataManagerService, ActorCacheService],
})
export class MetadataManagerModule {}