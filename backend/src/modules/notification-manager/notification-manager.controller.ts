import { Controller, Get, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationManagerService, Notification } from './notification-manager.service';

@Controller('notifications')
export class NotificationManagerController {
  constructor(private readonly notificationService: NotificationManagerService) {}

  @Get()
  async getRecent(): Promise<Notification[]> {
    return this.notificationService.getRecentLogs(50);
  }

  @Patch('read/:id')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.notificationService.markAsRead(id);
    return { success: true };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(): Promise<{ success: boolean }> {
    await this.notificationService.markAllAsRead();
    return { success: true };
  }
}