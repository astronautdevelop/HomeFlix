import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreService } from './core.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}