import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoreModule } from '../../core/core.module';
import { MetadataManagerModule } from '../metadata-manager/metadata-manager.module';

@Module({
  imports: [PrismaModule, CoreModule, MetadataManagerModule, NotificationManagerModule],
  providers: [ActorService],
  controllers: [ActorController],
  exports: [ActorService],
})
export class ActorModule {}