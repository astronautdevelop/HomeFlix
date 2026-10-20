import { Injectable, Logger } from '@nestjs/common';
import { CoreService } from '../../core/core.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly COLLECTIONS_CACHE = 'collections';

  constructor(private coreService: CoreService) {}

  private getCachePath(): string {
    const basePath = this.coreService.getCachePath();
    return path.resolve(basePath, this.COLLECTIONS_CACHE); // 🔥 path.resolve rende il path assoluto
  }

  async ensureCacheDir(): Promise<void> {
    await fs.mkdir(this.getCachePath(), { recursive: true });
  }

  async saveImage(
    collectionId: string,
    fileBuffer: Buffer,
    originalName: string,
    type: 'poster' | 'background' = 'poster',
  ): Promise<string> {
    await this.ensureCacheDir();

    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const validExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
      ? ext
      : '.jpg';
    const filename = `${collectionId}_${type}${validExt}`;
    const filePath = path.join(this.getCachePath(), filename);

    await fs.writeFile(filePath, fileBuffer);
    this.logger.log(`Immagine ${type} salvata: ${filePath}`);

    return `/api/collections/image/${filename}`;
  }

  async deleteImage(collectionId: string, type?: 'poster' | 'background'): Promise<void> {
    const dir = this.getCachePath();
    try {
      const files = await fs.readdir(dir);
      const pattern = type
        ? new RegExp(`^${collectionId}(_${type})?\\..+$`)
        : new RegExp(`^${collectionId}.*\\..+$`);

      for (const file of files) {
        if (pattern.test(file)) {
          await fs.unlink(path.join(dir, file));
          this.logger.log(`Immagine eliminata: ${file}`);
        }
      }
    } catch (error: any) {
      this.logger.warn(
        `Errore eliminazione immagine per ${collectionId}: ${error.message}`,
      );
    }
  }

  async getImagePath(filename: string): Promise<string | null> {
    const filePath = path.join(this.getCachePath(), filename);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      return null;
    }
  }

  async clearAllImages(): Promise<void> {
    const dir = this.getCachePath();
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        await fs.unlink(path.join(dir, file));
      }
      this.logger.log('Tutte le immagini collezioni eliminate');
    } catch (error: any) {
      this.logger.warn(`Errore pulizia immagini: ${error.message}`);
    }
  }
}