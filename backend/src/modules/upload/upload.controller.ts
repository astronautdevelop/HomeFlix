import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import * as fs from 'fs/promises'; // 🔥
import type { Response } from 'express';

@Controller('collections')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @Query('type') type: string = 'poster',
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File non fornito');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("L'immagine non deve superare i 5MB");
    }

    const url = await this.uploadService.saveImage(
      id,
      file.buffer,
      file.originalname,
      type as 'poster' | 'background',
    );
    return { url, success: true };
  }

  @Get('image/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.uploadService.getImagePath(filename);
    if (!filePath) {
      throw new NotFoundException('Immagine non trovata');
    }

    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    const contentType = mimeTypes[ext] || 'image/jpeg';

    // 🔥 Leggi il file e invialo manualmente (evita problemi sendFile su Windows)
    const fileBuffer = await fs.readFile(filePath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(fileBuffer);
  }
}