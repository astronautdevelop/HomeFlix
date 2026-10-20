import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MediaScannerService } from './media-scanner.service';
import { ScanResultDto } from './dto/scan-result.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('library')
export class MediaScannerController {
  constructor(
    private readonly mediaScannerService: MediaScannerService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('scan')
  @HttpCode(HttpStatus.ACCEPTED)
  async scanLibrary(): Promise<{ message: string; result: ScanResultDto }> {
    const result = await this.mediaScannerService.scanAllDevices();
    return {
      message: 'Scansione completata',
      result,
    };
  }

  @Get('scan/status')
  async getScanStatus(): Promise<{
    status: string;
    isScanning: boolean;
    lastScan?: any;
  }> {
    const lastScan = await this.prisma.scanLog.findFirst({
      orderBy: { startedAt: 'desc' },
    });
    return {
      status: lastScan?.status || 'never',
      isScanning: this.mediaScannerService.getIsScanning(),
      lastScan,
    };
  }
}