// prisma.config.js
import 'dotenv/config'; // <-- Carica le variabili dal file .env

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    // Usa process.env per leggere la variabile DATABASE_URL
    url: process.env.DATABASE_URL,
  },
};