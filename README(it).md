# HomeFlix

**HomeFlix** è una piattaforma di gestione media self-hosted progettata per l'uso personale e familiare. Permette di organizzare, riprodurre e gestire la propria libreria di film e serie TV in un'interfaccia moderna e intuitiva.

## ✨ Caratteristiche principali

- **Privacy**: Nessuna autenticazione, dati locali, offline-first.
- **Performance**: Scansione veloce, streaming ottimizzato, ricerca istantanea.
- **Modularità**: Architettura a moduli indipendenti e sostituibili.
- **Scalabilità**: Supporto per migliaia di film, serie TV e video personali.

## 🛠️ Tecnologie utilizzate

### Backend
- **NestJS** (10.x) - Framework backend (TypeScript)
- **Prisma** (5.x) - ORM per PostgreSQL
- **PostgreSQL** (15.x) - Database principale
- **WebSocket** (Socket.IO) - Notifiche in tempo reale
- **Axios** - Richieste HTTP a TMDB
- **TypeScript** (5.x) - Type safety
- **Multer** - Upload file (immagini collezioni)

### Frontend
- **React** (18+) - Framework UI
- **TypeScript** (5.x) - Type safety
- **Vite** (8.x) - Build tool
- **Tailwind CSS** (4.x) - Styling (dark theme)
- **React Router** (v6) - Routing
- **React Query** (5.x) - Gestione API e caching
- **Zustand** (4.x) - Stato globale
- **Video.js** (8.x) - Player video (con plugin qualità)
- **Socket.IO Client** (4.x) - Notifiche real-time
- **React Hook Form** (7.x) - Gestione form

## 📋 Prerequisiti

Prima di poter avviare l'applicazione, è necessario installare i seguenti software:

1.  **Node.js** (versione 18 o superiore) - [Scarica Node.js](https://nodejs.org/)
2.  **PostgreSQL** (versione 15 o superiore) - [Scarica PostgreSQL](https://www.postgresql.org/download/)
3.  **Git** (opzionale, ma consigliato per clonare il repository) - [Scarica Git](https://git-scm.com/)

> **⚠️ Nota importante sulle dipendenze**
> Questo repository **non include** le cartelle `node_modules` (le dipendenze del progetto). Questo è intenzionale per mantenere il repository leggero e per evitare problemi di compatibilità. Prima di avviare l'applicazione, **è necessario installare tutte le dipendenze** eseguendo il comando `npm install` sia nella cartella `backend` che nella cartella `frontend`, come descritto di seguito. Senza questo passaggio, l'applicazione non funzionerà.

## 🚀 Guida all'avvio

Segui questi passaggi per avviare l'applicazione sul tuo computer.

### 1. Clona il repository (o scarica lo ZIP)

```bash
git clone https://github.com/astronautdevelop/homeflix.git
cd homeflix
