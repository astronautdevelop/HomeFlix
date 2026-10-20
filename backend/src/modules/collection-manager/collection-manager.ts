import { Module } from '@nestjs/common';
import { CollectionManagerService } from './collection-manager.service';
import { CollectionManagerController } from './collection-manager.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [CollectionManagerService, PrismaService],
  controllers: [CollectionManagerController],
  exports: [CollectionManagerService],
})
export class CollectionManagerModule {}