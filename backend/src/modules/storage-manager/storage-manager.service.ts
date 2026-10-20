import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { promises as fs } from 'fs';
import type { Stats } from 'fs';  // <-- importa il tipo Stats da 'fs' (non da 'fs/promises')
import * as path from 'path';
import * as diskusage from 'diskusage';
import { CoreService } from '../../core/core.service';

export interface StorageDevice {
  path: string;
  isAvailable: boolean;
  totalSpace: number;
  freeSpace: number;
  type?: 'SSD' | 'HDD' | 'NAS' | 'Cartella';
}

@Injectable()
export class StorageManagerService implements OnApplicationBootstrap {
  private devices: StorageDevice[] = [];

  constructor(private coreService: CoreService) {}

  async onApplicationBootstrap() {
    await this.refreshDevices();
  }

  async refreshDevices(): Promise<void> {
    const roots = this.coreService.getMediaRoots();
    this.devices = [];

    for (const root of roots) {
      try {
        const stats = await fs.stat(root);
        if (!stats.isDirectory()) {
          this.coreService.warn(`Il percorso ${root} non è una cartella valida`);
          continue;
        }

        // Ottieni spazio su disco (funziona su Windows e Unix)
        let totalSpace = 0;
        let freeSpace = 0;
        let type: StorageDevice['type'] = 'Cartella';

        try {
          const usage = await diskusage.check(root);
          totalSpace = usage.total;
          freeSpace = usage.free;

          // Rilevazione tipo (semplificata)
          // Puoi migliorare con logiche più raffinate
          if (process.platform === 'win32') {
            // Su Windows, se la radice è un drive letter, può essere SSD/HDD
            const drive = root.charAt(0).toUpperCase();
            // Potresti usare wmic o altri strumenti, ma per ora mettiamo 'HDD'
            type = 'HDD';
          } else {
            // Su Linux/Mac, controlla se è un mount point di rete
            // (implementazione base)
            type = 'Cartella';
          }
        } catch (spaceError) {
          this.coreService.warn(`Impossibile ottenere spazio per ${root}: ${spaceError.message}`);
          // Usa valori placeholder se fallisce
          totalSpace = 1024 * 1024 * 1024 * 1024; // 1TB
          freeSpace = 512 * 1024 * 1024 * 1024;  // 512GB
        }

        this.devices.push({
          path: root,
          isAvailable: true,
          totalSpace,
          freeSpace,
          type,
        });
      } catch (error) {
        this.coreService.error(
          `Errore nell'accesso a ${root}: ${error.message}`,
          error.stack,
        );
        this.devices.push({
          path: root,
          isAvailable: false,
          totalSpace: 0,
          freeSpace: 0,
          type: "Cartella",
        });
      }
    }
  }

  getDevices(): StorageDevice[] {
    return this.devices;
  }

  getAvailableDevices(): StorageDevice[] {
    return this.devices.filter((d) => d.isAvailable);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listDirectory(dirPath: string): Promise<string[]> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      return entries.map((entry) => entry.name);
    } catch {
      return [];
    }
  }

  async isDirectory(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async getFileStats(filePath: string): Promise<Stats | null> {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

  joinPath(...parts: string[]): string {
    return path.join(...parts);
  }
}