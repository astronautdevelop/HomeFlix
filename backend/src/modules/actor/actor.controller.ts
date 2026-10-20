import { Controller, Get, Param, NotFoundException, Res, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { ActorService } from './actor.service';
import { ActorCacheService } from '../metadata-manager/actor-cache.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('actor')
export class ActorController {
  private readonly logger = new Logger(ActorController.name);

  constructor(
    private actorService: ActorService,
    private actorCache: ActorCacheService,
  ) {}

  @Get(':name/details')
  async getActorDetails(@Param('name') name: string) {
    const details = await this.actorService.getActorDetails(decodeURIComponent(name));
    if (!details) {
      throw new NotFoundException('Attore non trovato');
    }
    return details;
  }

  @Get(':name/movies')
  async getActorMovies(@Param('name') name: string) {
    const movies = await this.actorService.getMoviesForActor(decodeURIComponent(name));
    return movies;
  }

  @Get(':name/image')
  async getActorImage(@Param('name') name: string, @Res() res: Response) {
    try {
      const decoded = decodeURIComponent(name);
      const cachePath = this.actorCache.getCachePath();
      const safeName = decoded
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');
      const filePath = path.resolve(path.join(cachePath, `${safeName}.jpg`));
      
      this.logger.log(`🔍 Cercando immagine attore: ${filePath}`);
      
      // Verifica che il file esista
      if (!fs.existsSync(filePath)) {
        this.logger.error(`❌ File non trovato: ${filePath}`);
        return res.status(404).json({ error: 'Immagine non trovata' });
      }

      this.logger.log(`✅ Immagine trovata: ${filePath}`);
      
      // Imposta Content-Type
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      
      // Crea stream e pipe alla risposta
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      
      stream.on('error', (err) => {
        this.logger.error(`❌ Errore stream: ${err.message}`);
        res.status(500).json({ error: 'Errore nel servire l\'immagine' });
      });
    } catch (error) {
      this.logger.error(`❌ Errore generico: ${error.message}`);
      res.status(500).json({ error: 'Errore interno' });
    }
  }

  @Get('cleanup')
  async cleanup() {
    const result = await this.actorService.runGarbageCollection();
    return {
      message: 'Garbage Collection eseguita',
      ...result,
    };
  }
}