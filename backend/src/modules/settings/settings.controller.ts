import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ValidateTmdbKeyDto } from './dto/validate-tmdb-key.dto';
import { StorageManagerService } from '../storage-manager/storage-manager.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private storageManager: StorageManagerService,
  ) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }

  /**
   * Valida una chiave API TMDB (non la salva).
   * Body: { key: string }
   * Ritorno: { valid: boolean, message: string }
   */
  @Post('validate-tmdb-key')
  @HttpCode(HttpStatus.OK)
  async validateTmdbKey(@Body() dto: ValidateTmdbKeyDto) {
    return this.settingsService.validateTmdbKey(dto.key);
  }

  @Get('disk-space')
  async getDiskSpace() {
    await this.storageManager.refreshDevices();
    return this.storageManager.getDevices();
  }
}