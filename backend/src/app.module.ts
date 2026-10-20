import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageManagerModule } from './modules/storage-manager/storage-manager.module';
import { MediaScannerModule } from './modules/media-scanner/media-scanner.module';
import { MetadataManagerModule } from './modules/metadata-manager/metadata-manager.module';
import { MediaController } from './modules/media/media.controller';
import { MediaModule } from './modules/media/media.module';
import { PlayerEngineModule } from './modules/player-engine/player-engine.module';
import { NotificationManagerModule } from './modules/notification-manager/notification-manager.module';
import { FileModule } from './modules/file/file.module';
import { CollectionManagerModule } from './modules/collection-manager/collection-manager.module';
import { UploadModule } from './modules/upload/upload.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ActorModule } from './modules/actor/actor.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot({ global: true }),
    CoreModule,
    PrismaModule,
    StorageManagerModule,
    MediaScannerModule,
    MetadataManagerModule,
    MediaModule,
    PlayerEngineModule,
    NotificationManagerModule,
    FileModule,
    UploadModule, // 🔥 Deve venire PRIMA di CollectionManagerModule per il routing immagini
    CollectionManagerModule,
    HealthCheckModule,
    StatisticsModule,
    ActorModule,
    SettingsModule,
  ],
  controllers: [MediaController],
  providers: [],
})
export class AppModule {}