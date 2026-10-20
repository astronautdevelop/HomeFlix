import { Controller, Get, Delete } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    return this.statisticsService.getStatistics();
  }

  @Delete()
  async resetStatistics() {
    return this.statisticsService.resetStatistics();
  }
}