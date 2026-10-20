import { Module } from '@nestjs/common';
import { StorageManagerService } from './storage-manager.service';

@Module({
  providers: [StorageManagerService],
  exports: [StorageManagerService],
})
export class StorageManagerModule {}