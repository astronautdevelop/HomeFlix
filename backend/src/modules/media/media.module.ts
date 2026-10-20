import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CoreService } from '../../core/core.service';
import { ActorCacheService } from '../metadata-manager/actor-cache.service';
import { ActorModule } from '../actor/actor.module';
import { MetadataManagerModule } from '../metadata-manager/metadata-manager.module';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [
    MetadataManagerModule, PrismaModule, CoreModule, ActorModule, NotificationManagerModule
  ],
  controllers: [MediaController],
  providers: [ActorCacheService],
})
export class MediaModule {}