import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageManagerModule } from '../storage-manager/storage-manager.module';
import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { MetadataManagerModule } from '../metadata-manager/metadata-manager.module';
import { MediaScannerService } from './media-scanner.service';
import { MediaScannerController } from './media-scanner.controller';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    StorageManagerModule,
    NotificationManagerModule,
    MetadataManagerModule,
    CoreModule,
    PrismaModule
  ],
  providers: [MediaScannerService],
  controllers: [MediaScannerController],
  exports: [MediaScannerService],
})
export class MediaScannerModule {}