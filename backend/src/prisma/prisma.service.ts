import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Crea il pool di connessioni PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Crea l'adapter per Prisma
    const adapter = new PrismaPg(pool);
    
    // Passa l'adapter al costruttore di PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}