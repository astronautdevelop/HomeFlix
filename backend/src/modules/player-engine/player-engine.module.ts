import { Module } from '@nestjs/common';
import { PlayerEngineController } from './player-engine.controller';
import { PlayerEngineService } from './player-engine.service';
import { StorageManagerModule } from '../storage-manager/storage-manager.module';
import { PrismaService } from '../../prisma/prisma.service';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [StorageManagerModule, CoreModule, PrismaModule],
  controllers: [PlayerEngineController],
  providers: [PlayerEngineService],
  exports: [PlayerEngineService],
})
export class PlayerEngineModule {}