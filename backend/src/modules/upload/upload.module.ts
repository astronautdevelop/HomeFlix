import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CoreModule } from '../../core/core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [CoreModule, PrismaModule], // 🔥
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}