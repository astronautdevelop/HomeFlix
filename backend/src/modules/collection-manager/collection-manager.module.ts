import { Module } from '@nestjs/common';
import { CollectionManagerService } from './collection-manager.service';
import { CollectionManagerController } from './collection-manager.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadModule } from '../upload/upload.module';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [UploadModule, CoreModule, PrismaModule],
  providers: [CollectionManagerService],
  controllers: [CollectionManagerController],
  exports: [CollectionManagerService],
})
export class CollectionManagerModule {}