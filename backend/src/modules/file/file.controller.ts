// backend/src/modules/file/file.controller.ts

import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  private readonly MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.ico': 'image/x-icon',
  };

  /**
   * Cerca un file in una directory ignorando il case del nome.
   */
  private findFileCaseInsensitive(basePath: string): string | null {
    const dir = path.dirname(basePath);
    const targetFile = path.basename(basePath);

    if (!fs.existsSync(dir)) {
      return null;
    }

    try {
      const files = fs.readdirSync(dir);
      const match = files.find(
        (f) => f.toLowerCase() === targetFile.toLowerCase(),
      );
      if (match) {
        const foundPath = path.join(dir, match);
        this.logger.log(`🔍 Trovato con case diverso: ${foundPath}`);
        return foundPath;
      }
    } catch (error) {
      this.logger.error(`❌ Errore readdir: ${error.message}`);
    }

    return null;
  }

  @Get(':encodedPath')
  async serveFile(@Param('encodedPath') encodedPath: string, @Res() res: Response) {
    try {
      // 1. Decodifica
      let filePath = decodeURIComponent(encodedPath);

      // 2. Normalizzazione Windows
      if (process.platform === 'win32') {
        filePath = filePath.replace(/\//g, '\\');
      }

      this.logger.log(`📁 Richiesta file: ${filePath}`);

      // 3. Trova il file (case-insensitive su Windows)
      let actualPath: string | null = null;
      if (fs.existsSync(filePath)) {
        actualPath = filePath;
      } else {
        actualPath = this.findFileCaseInsensitive(filePath);
      }

      if (!actualPath) {
        throw new NotFoundException('File non trovato');
      }

      // 4. Verifica che sia un file
      const stats = fs.statSync(actualPath);
      if (!stats.isFile()) {
        throw new NotFoundException('Il percorso non è un file');
      }

      // 5. MIME type
      const ext = path.extname(actualPath).toLowerCase();
      const mimeType = this.MIME_TYPES[ext] || 'application/octet-stream';

      // 6. Headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Cache-Control', 'public, max-age=86400');

      // 7. 🔥 Streaming manuale (evita il bug di res.sendFile su path Windows)
      const stream = createReadStream(actualPath);
      stream.on('error', (err) => {
        this.logger.error(`❌ Errore stream ${actualPath}: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).end();
        } else {
          res.end();
        }
      });

      this.logger.log(`✅ File servito: ${actualPath}`);
      stream.pipe(res);
    } catch (error) {
      this.logger.error(`❌ Errore serving file: ${error.message}`);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File non trovato' });
      }
    }
  }
}