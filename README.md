<div align="center">

# 🎬 HomeFlix

### La tua libreria multimediale personale, self-hosted.

**Organizza · Scopri · Riproduci · Monitora**

HomeFlix è una piattaforma self-hosted per gestire film, serie TV ed episodi archiviati su dischi locali o percorsi di rete. Unisce catalogazione automatica, metadati, riproduzione video, collezioni personalizzate e strumenti per controllare lo stato della libreria, con un'interfaccia web moderna a tema scuro.

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=20232A)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2D3748?logo=prisma&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socketdotio&logoColor=white)

<br />

**Stato documentato:** backend completato · frontend in sviluppo avanzato  
**Versione delle specifiche:** 2.0 · **Documentazione tecnica di riferimento:** 17 agosto 2026

</div>

---

## 📚 Indice

- [Panoramica](#-panoramica)
- [Funzionalità](#-funzionalità-principali)
- [Stack tecnologico](#-stack-tecnologico)
- [Architettura](#-architettura)
- [Avvio rapido](#-avvio-rapido)
- [Configurazione](#-configurazione)
- [Struttura del progetto](#-struttura-del-progetto)
- [Modello dati](#-modello-dati)
- [API e comunicazione realtime](#-api-e-comunicazione-realtime)
- [Cache e gestione dei file](#-cache-e-gestione-dei-file)
- [Scansione e integrità della libreria](#-scansione-e-integrità-della-libreria)
- [Sviluppo e convenzioni](#-sviluppo-e-convenzioni)
- [Roadmap](#-roadmap)
- [Risoluzione dei problemi](#-risoluzione-dei-problemi)
- [Sicurezza e privacy](#-sicurezza-e-privacy)
- [Crediti e riferimenti](#-crediti-e-riferimenti)

---

## 🌌 Panoramica

HomeFlix nasce per offrire un punto di accesso unico ai contenuti video conservati su computer, dischi esterni, NAS o altre cartelle configurate dall'utente. Il backend indicizza i file e mantiene i dati strutturati in PostgreSQL; il frontend presenta la libreria, consente la navigazione dei contenuti e comunica con il backend tramite API HTTP e WebSocket.

### Principi di progetto

| Principio | Descrizione |
|---|---|
| 🔒 **Privacy** | Progettato per uso personale e familiare, con dati e media conservati nell'ambiente dell'utente. |
| ⚡ **Performance** | Scansione ricorsiva, streaming con supporto HTTP Range, cache delle immagini e caching delle query lato frontend. |
| 🧩 **Modularità** | Moduli NestJS separati per scansione, metadati, playback, notifiche, collezioni e impostazioni. |
| 📦 **Scalabilità** | Struttura progettata per librerie composte da migliaia di film, serie TV e video personali. |
| 🌐 **Uso locale/offline-first** | I contenuti locali restano il fulcro dell'applicazione; il recupero dei metadati online dipende dalla disponibilità di TMDB e della rete. |

> [!IMPORTANT]
> Le specifiche descrivono HomeFlix come applicazione **senza autenticazione**. È quindi pensata per un ambiente personale o fidato: non esporre direttamente il servizio a Internet senza aggiungere un livello di autenticazione, autorizzazione e protezione adeguato.

---

## ✨ Funzionalità principali

### 🎞️ Libreria multimediale

- Scansione ricorsiva delle cartelle configurate.
- Indicizzazione di film, serie TV, stagioni ed episodi.
- Rilevamento delle versioni disponibili dello stesso media, con qualità e percorsi associati.
- Riconoscimento delle serie TV a partire dal nome del file dell'episodio.
- Ricerca e navigazione per titolo, regista, attore e genere.
- Sezioni per continuare la visione, contenuti recenti, categorie e film casuale.
- Gestione della disponibilità dei file quando un disco viene scollegato o un percorso non è più raggiungibile.

### 🧠 Metadati e immagini

- Integrazione con [The Movie Database (TMDB)](https://www.themoviedb.org/) per metadati, poster, background, attori e informazioni sulle serie.
- Modifica manuale dei metadati per contenuti personali.
- Upload di poster e background personalizzati.
- Cache centralizzata per immagini di film, serie, episodi e attori.
- Immagini di fallback quando i metadati online non sono disponibili.
- Validazione della chiave API TMDB prima del salvataggio dalle impostazioni.
- Invalidazione della cache TMDB quando la chiave effettiva cambia.

### ▶️ Player video

- Streaming video dal backend con supporto alle richieste HTTP Range.
- Consultazione delle qualità disponibili.
- Recupero delle tracce audio e dei sottotitoli disponibili.
- Salvataggio del progresso di riproduzione.
- Ripresa dei contenuti lasciati in corso.
- Navigazione all'episodio precedente e successivo, anche tra stagioni.
- Avvio automatico dell'episodio successivo, secondo il flusso previsto dal frontend.
- Conteggio delle visioni completate quando il progresso supera la soglia dell'85%.

### 📺 Serie TV

- Una card aggregata per stagione nella libreria.
- Pagina di dettaglio della stagione con informazioni sulla serie e lista degli episodi.
- Badge stagione/episodio nella sezione “Continua a guardare”.
- Poster condiviso a livello di serie e background specifico per episodio.
- Ereditarietà dei metadati della serie da parte degli episodi per i campi previsti.
- Modifica separata dei metadati delle serie personali e dei singoli episodi.

### 🗂️ Collezioni personalizzate

- Creazione, modifica ed eliminazione delle collezioni.
- Aggiunta e rimozione dei film.
- Gestione dell'ordine dei contenuti.
- Upload di poster e background per le collezioni.

### 🔔 Monitoraggio e statistiche

- Notifiche in tempo reale via Socket.IO.
- Stato della scansione e barra di avanzamento sincronizzati con il backend.
- Notifiche aggregate per evitare spam durante scansioni estese.
- Report di integrità con metadati, immagini, file non disponibili, file rotti e duplicati rilevati.
- Dashboard con ore viste, film più guardati, generi preferiti e contenuti recenti.
- Gestione della cache e garbage collection delle immagini degli attori non più utilizzate.
- Logging delle richieste HTTP per facilitare monitoraggio e debugging.

---

## 🧰 Stack tecnologico

### Backend

| Tecnologia | Versione indicata nelle specifiche | Utilizzo |
|---|---:|---|
| [NestJS](https://nestjs.com/) | 10.x | API REST e architettura modulare |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipizzazione |
| [Prisma](https://www.prisma.io/) | 5.x | ORM, schema e accesso ai dati |
| [PostgreSQL](https://www.postgresql.org/) | 15.x | Database relazionale |
| [Socket.IO](https://socket.io/) | 4.x | Eventi in tempo reale |
| [Axios](https://axios-http.com/) | 1.x | Richieste HTTP, inclusa l'integrazione TMDB |
| [Multer](https://github.com/expressjs/multer) | 1.x | Upload di immagini |
| `class-validator` | 0.14.x | Validazione DTO |

### Frontend

| Tecnologia | Versione indicata nelle specifiche | Utilizzo |
|---|---:|---|
| [React](https://react.dev/) | 18+ | Interfaccia utente |
| TypeScript | 5.x | Tipizzazione |
| [Vite](https://vite.dev/) | Specifiche: 8.x; package di riferimento: 4.x | Server di sviluppo e build |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling e tema scuro |
| [React Router](https://reactrouter.com/) | 6.x | Routing |
| [TanStack React Query](https://tanstack.com/query) | 5.x | Fetching e cache delle query |
| [Zustand](https://zustand-demo.pmnd.rs/) | 4.x | Stato globale |
| [Video.js](https://videojs.com/) | 8.x | Player video |
| Socket.IO Client | 4.x | Eventi realtime |
| React Hook Form | 7.x | Gestione dei form prevista dallo stack |

> [!NOTE]
> La documentazione tecnica riporta versioni differenti di Vite in sezioni diverse (8.x nella panoramica e 4.x nel package di riferimento). Per l'installazione, fanno fede i `package.json` effettivamente presenti nella repository.

---

## 🏗️ Architettura

HomeFlix è organizzato in un backend NestJS e un frontend React/TypeScript. PostgreSQL conserva i dati strutturati; il filesystem contiene i media originali e la cache delle risorse derivate.

```mermaid
flowchart TD
    A["💽 Dischi locali / NAS"] --> B["Media Scanner"]
    B --> C[("PostgreSQL")]
    D["TMDB API"] <--> E["Metadata Manager"]
    E --> C
    E --> F["Cache immagini e metadati"]
    G["Frontend React"] <--> H["API REST NestJS"]
    H --> C
    H --> I["Player Engine"]
    I --> J["🎬 Streaming video"]
    H <--> K["Notification Manager"]
    K <--> L["Socket.IO / WebSocket"]
    H --> M["Collection Manager"]
```

### Moduli backend

| Modulo | Responsabilità |
|---|---|
| **Core** | Configurazione, logging, percorsi media e cache condivisi, eventi interni. |
| **Storage Manager** | Lettura delle cartelle configurate, dispositivi e informazioni sui file. |
| **Media Scanner** | Scansione ricorsiva, hash, qualità, riconoscimento serie e rilevamento duplicati. |
| **Metadata Manager** | Integrazione TMDB, metadati locali, immagini e cache. |
| **Player Engine** | Streaming, qualità, audio, sottotitoli, progresso e navigazione episodi. |
| **Notification Manager** | Notifiche persistenti, TTL, broadcast WebSocket ed eventi di scansione. |
| **Collection Manager** | CRUD delle collezioni e associazione dei media. |
| **Upload** | Upload e gestione delle immagini delle collezioni. |
| **Health Check** | Controlli di integrità del catalogo e dei file associati. |
| **Statistics** | Statistiche di visione e azzeramento dei contatori. |
| **Media** | Ricerca, catalogo, film, stagioni, serie ed episodi. |
| **Settings** | Chiave TMDB, percorsi media e informazioni sullo spazio disco. |
| **Actor** | Dettagli, filmografia e cache delle immagini degli attori. |
| **Prisma** | Connessione al database tramite Prisma Client. |

### Frontend: pagine principali

- **Library** — home della libreria, righe per genere, serie e contenuti da continuare.
- **Movie Details** — dettagli, cast, trailer, qualità e metadati.
- **Season Details** — dettagli della serie/stagione e lista episodi.
- **Player** — riproduzione e navigazione tra episodi.
- **Search** — ricerca dei contenuti.
- **Collections / Collection Details** — gestione delle raccolte personalizzate.
- **Genre Details** — contenuti di una categoria.
- **Actor Details** — biografia e filmografia.
- **Health Check** — report di integrità.
- **Statistics** — statistiche di visione.
- **Datacenter** — elenco completo e gestione dei media.
- **Settings** — percorsi media e configurazione TMDB.
- **Guide** — guida all'utilizzo dell'applicazione.

---

## 🚀 Avvio rapido

Questa sezione descrive un avvio locale di sviluppo sulla base delle specifiche fornite. I comandi presuppongono una repository con directory `backend/` e `frontend/`; se la struttura reale differisce, adegua i percorsi.

### Prerequisiti

- Node.js e npm compatibili con le dipendenze del progetto.
- PostgreSQL 15.x (o versione compatibile con lo schema in uso).
- Git.
- Uno o più percorsi contenenti file video accessibili all'utente che esegue il backend.
- Una chiave API TMDB per il recupero online dei metadati (facoltativa, ma necessaria per le funzionalità TMDB).

### 1. Clona la repository

```bash
git clone <URL_DELLA_REPOSITORY>
cd <NOME_DELLA_REPOSITORY>
```

### 2. Crea il database PostgreSQL

Crea un database dedicato, ad esempio `homeflix`, e annota host, porta, nome database, utente e password. L'esempio seguente assume PostgreSQL locale sulla porta standard.

### 3. Configura il backend

Crea `backend/.env` usando come riferimento il seguente template:

```dotenv
# Connessione PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/homeflix?schema=public"

# Percorsi media in formato array JSON.
# Sostituisci i percorsi di esempio con cartelle realmente accessibili.
MEDIA_ROOTS='["/percorso/media/film", "/percorso/media/serie"]'

# Chiave TMDB (opzionale; fallback iniziale)
TMDB_API_KEY="INSERISCI_LA_TUA_CHIAVE"

# Directory cache (opzionale)
CACHE_PATH=".homeflix/cache"
```

Su Windows, usa percorsi validi per il sistema operativo e verifica che l'array JSON sia valido.

> **Priorità delle impostazioni:** `TMDB_API_KEY` e `MEDIA_ROOTS` vengono lette prima dal database (tabella `Setting`); se il valore nel database è vuoto, viene usato il fallback del file `.env`. La pagina Settings aggiorna i valori persistenti nel database.

### 4. Installa le dipendenze e prepara Prisma

```bash
cd backend
npm install
npx prisma generate
```

Per applicare le migrazioni in ambiente di sviluppo, se il progetto contiene le migrazioni Prisma:

```bash
npx prisma migrate dev
```

> Se la repository utilizza un flusso di migrazione diverso, segui le istruzioni presenti nel progetto e non creare migrazioni alla cieca su un database con dati esistenti.

### 5. Avvia il backend

Dalla directory `backend/`:

```bash
npm run start:dev
```

Le specifiche fanno riferimento al backend su `http://localhost:3000`. L'eventuale documentazione API/Swagger è indicata come futura: non è garantito che `/api` sia disponibile nella versione corrente.

### 6. Avvia il frontend

Apri un secondo terminale:

```bash
cd frontend
npm install
npm run dev
```

Apri nel browser l'URL locale stampato da Vite nel terminale. Verifica che la configurazione del client API punti al backend corretto e che la connessione Socket.IO utilizzi l'host previsto.

### Comandi utili

| Attività | Comando | Directory |
|---|---|---|
| Backend in sviluppo | `npm run start:dev` | `backend/` |
| Backend produzione | `npm run build` e `npm run start:prod` se gli script sono presenti | `backend/` |
| Generazione Prisma Client | `npx prisma generate` | `backend/` |
| Migrazioni sviluppo | `npx prisma migrate dev` | `backend/` |
| Interfaccia database | `npx prisma studio` | `backend/` |
| Frontend sviluppo | `npm run dev` | `frontend/` |
| Build frontend | `npm run build` | `frontend/` |
| Preview build frontend | `npm run preview` | `frontend/` |

I comandi effettivamente disponibili sono quelli dichiarati nei `package.json` della repository.

---

## ⚙️ Configurazione

### Variabili d'ambiente backend

| Variabile | Obbligatoria | Descrizione |
|---|---|---|
| `DATABASE_URL` | Sì | URL di connessione PostgreSQL usato da Prisma. |
| `MEDIA_ROOTS` | No, se configurata da Settings | Array JSON di percorsi da indicizzare; usato come fallback iniziale. |
| `TMDB_API_KEY` | No | Chiave TMDB di fallback per metadati e immagini online. |
| `CACHE_PATH` | No | Percorso della cache locale; nelle specifiche il valore d'esempio è `.homeflix/cache`. |

### TMDB

La chiave può essere verificata tramite `POST /settings/validate-tmdb-key` prima di salvarla. Il servizio verifica la configurazione chiamando l'endpoint TMDB `/configuration`, con timeout documentato di 8 secondi. La validazione distingue, tra gli altri casi, chiave non valida, timeout, assenza di rete e chiave vuota.

Quando la chiave effettiva viene modificata o rimossa, il backend emette l'evento interno `tmdb-key-changed` per invalidare la cache TMDB in memoria.

### Percorsi media

- Configura solo percorsi esistenti e accessibili al processo backend.
- Per dischi rimovibili o NAS, considera che i file possono diventare temporaneamente non disponibili.
- Dopo aver configurato i percorsi, avvia una scansione della libreria.
- La pagina Settings può mostrare lo spazio totale e libero dei percorsi configurati.

---

## 🗂️ Struttura del progetto

La struttura seguente è **logica**, ricavata dai moduli documentati; non sostituisce l'albero reale dei file della repository.

```text
HomeFlix/
├── backend/
│   ├── src/
│   │   ├── core/
│   │   ├── storage-manager/
│   │   ├── media-scanner/
│   │   ├── metadata-manager/
│   │   ├── player-engine/
│   │   ├── notification-manager/
│   │   ├── collection-manager/
│   │   ├── upload/
│   │   ├── health-check/
│   │   ├── statistics/
│   │   ├── media/
│   │   ├── settings/
│   │   ├── actor/
│   │   ├── prisma/
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env                 # locale, non versionare
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── stores/
│   │   └── ...
│   └── ...
│
└── README.md
```

I nomi delle directory possono differire da questo schema: usa la struttura effettivamente presente nel repository come riferimento definitivo.

---

## 🗃️ Modello dati

Il database è definito tramite Prisma. I principali modelli documentati sono:

| Modello | Ruolo |
|---|---|
| `Media` | Entità principale per film ed episodi; contiene hash, titolo, metadati, disponibilità e contatore visualizzazioni. |
| `MediaVersion` | Percorsi e qualità alternative di un media, con dimensione e data di modifica. |
| `Series` | Metadati condivisi della serie TV. |
| `Season` | Stagione appartenente a una serie, con numero, dati descrittivi ed episodi. |
| `Collection` | Collezione personalizzata con descrizione e immagini. |
| `CollectionMedia` | Relazione tra collezione e media, con ordine opzionale. |
| `WatchHistory` | Cronologia, progresso, qualità e data di visione. |
| `Favorite` | Associazione dei media preferiti. |
| `ScanLog` | Risultati e dettagli delle scansioni, inclusi i gruppi di duplicati. |
| `NotificationLog` | Notifiche persistenti, stato di lettura e TTL. |
| `Setting` | Impostazioni persistenti, inclusi percorsi media e chiave TMDB. |

### Note importanti sul modello

- `Media.hash` è univoco. I duplicati non vengono inseriti come record distinti: vengono rilevati durante la scansione e registrati nei dettagli dell'ultimo `ScanLog` completato.
- `MediaVersion` permette di associare più qualità/percorso allo stesso media.
- Gli episodi sono rappresentati da `Media` con tipo `EPISODE` e collegamenti a serie/stagione.
- Le immagini di film e serie sono conservate in una cache centralizzata; i relativi campi URL/path nel database fanno riferimento a tali file.
- Gli episodi condividono il poster della serie, mentre il background può essere specifico dell'episodio.
- Per gli episodi non viene scritto `metadata.json` nella cartella condivisa: i metadati dell'episodio sono conservati nel database.

---

## 🔌 API e comunicazione realtime

Gli endpoint seguenti sono una panoramica dei percorsi descritti nelle specifiche, non un contratto OpenAPI esaustivo. Le risposte e i DTO esatti vanno verificati nel codice sorgente.

### Libreria e scansione

| Metodo | Endpoint | Scopo |
|---|---|---|
| `POST` | `/library/scan` | Avvia la scansione della libreria. |
| `GET` | `/library/scan/status` | Restituisce lo stato della scansione e `isScanning`. |
| `POST` | `/media/check-availability` | Aggiorna la disponibilità dei file indicizzati. |
| `GET` | `/media` | Elenca i media; gli episodi sono esclusi di default. |
| `GET` | `/media/:id` | Dettaglio del media e versioni. |
| `GET` | `/media/random` | Restituisce un film casuale disponibile. |
| `GET` | `/media/seasons` | Elenca le stagioni aggregate. |
| `GET` | `/media/seasons/:seasonId` | Dettaglio stagione, serie ed episodi. |
| `GET` | `/media/continue-watching` | Contenuti da continuare, con informazioni serie/episodio. |
| `GET` | `/media/search?q=...` | Ricerca e aggregazione dei risultati delle serie. |
| `GET` | `/media/genres` | Conteggi per genere. |
| `GET` | `/media/by-genre/:genre` | Contenuti filtrati per genere. |
| `GET` | `/health-check` | Report di integrità della libreria. |

Per includere gli episodi nella lista media è documentato il parametro `?includeEpisodes=true`.

### Metadati e impostazioni

| Metodo | Endpoint | Scopo |
|---|---|---|
| `POST` | `/metadata/update/:mediaId` | Aggiorna i metadati di un media. |
| `POST` | `/metadata/update-all` | Aggiorna i metadati di tutti i media. |
| `GET` | `/metadata/status` | Statistiche sulla provenienza dei metadati. |
| `PATCH` | `/media/:id/metadata` | Salva metadati locali di un film. |
| `POST` | `/media/:id/metadata/poster` | Carica un poster personalizzato. |
| `POST` | `/media/:id/metadata/background` | Carica un background personalizzato. |
| `PATCH` | `/media/series/:seriesId/metadata` | Modifica metadati di una serie. |
| `POST` | `/media/series/:seriesId/metadata/poster` | Carica il poster della serie e lo propaga agli episodi. |
| `POST` | `/media/series/:seriesId/metadata/background` | Carica il background della serie. |
| `PATCH` | `/media/episodes/:id/metadata` | Modifica metadati locali di un episodio. |
| `POST` | `/media/episodes/:id/metadata/background` | Carica lo still di un episodio. |
| `GET` | `/settings` | Legge le impostazioni. |
| `PUT` | `/settings` | Aggiorna le impostazioni. |
| `POST` | `/settings/validate-tmdb-key` | Valida una chiave TMDB senza salvarla. |
| `GET` | `/settings/disk-space` | Restituisce informazioni sullo spazio disco. |

### Player

| Metodo | Endpoint | Scopo |
|---|---|---|
| `GET` | `/player/info/:mediaId` | Informazioni sul media e qualità. |
| `GET` | `/player/qualities/:mediaId` | Qualità/file disponibili. |
| `GET` | `/player/play/:mediaId` | Stream video con supporto Range. |
| `GET` | `/player/subtitles/:mediaId` | Recupera i sottotitoli disponibili. |
| `GET` | `/player/audio/:mediaId` | Elenca le tracce audio. |
| `POST` | `/player/progress` | Salva il progresso di riproduzione. |
| `GET` | `/player/progress/:mediaId` | Recupera il progresso del media. |
| `GET` | `/player/continue-watching` | Elenca i contenuti in corso. |
| `GET` | `/player/episode-nav/:mediaId` | Recupera episodio precedente e successivo. |

### Collezioni, notifiche e attori

| Metodo | Endpoint | Scopo |
|---|---|---|
| `GET` / `POST` | `/collections` | Elenca o crea collezioni. |
| `GET` / `PUT` / `DELETE` | `/collections/:id` | Legge, modifica o elimina una collezione. |
| `POST` | `/collections/:id/media` | Aggiunge un media. |
| `DELETE` | `/collections/:id/media/:mediaId` | Rimuove un media. |
| `PUT` | `/collections/:id/order` | Aggiorna l'ordine. |
| `POST` | `/collections/:id/upload` | Carica immagini della collezione. |
| `GET` | `/notifications` | Recupera gli ultimi 50 log di notifica. |
| `PATCH` | `/notifications/read/:id` | Segna una notifica come letta. |
| `PATCH` | `/notifications/read-all` | Segna tutte le notifiche come lette. |
| `GET` | `/actor/:name/details` | Recupera i dettagli di un attore. |
| `GET` | `/actor/:name/movies` | Recupera la filmografia. |
| `GET` | `/actor/:name/image` | Recupera l'immagine in cache. |
| `GET` | `/actor/cleanup` | Avvia la pulizia manuale della cache attori. |
| `GET` | `/statistics` | Recupera le statistiche di visione. |
| `DELETE` | `/statistics` | Azzera cronologia e contatori di visione. |

### Eventi Socket.IO

Il backend comunica con i client connessi tramite eventi realtime, tra cui:

| Evento | Quando viene emesso |
|---|---|
| `connect` / `disconnect` | Connessione o disconnessione del client. |
| `notification` | Nuova notifica. |
| `scan-started` | Avvio di una scansione. |
| `scan-completed` | Completamento della scansione con conteggi aggregati. |

I tipi di notifica documentati sono `info`, `success`, `warning`, `error`, `special` e `detail`. La UI applica comportamenti visivi e tempi di chiusura differenti in base al tipo.

---

## 🖼️ Cache e gestione dei file

La cache centralizzata è collocata, per impostazione documentata, sotto `.homeflix/cache/`.

```text
.homeflix/cache/
├── media/
│   ├── poster/
│   └── background/
├── collections/
├── actors/
└── metadata/
    └── actors/
```

- **Film:** immagini nominate con l'ID del media.
- **Serie TV:** immagini con prefisso `series_<seriesId>`.
- **Episodi:** poster ereditato dalla serie e background/still specifico.
- **Attori:** immagini e metadati gestiti dalla cache e dalla garbage collection.
- **Collezioni:** immagini caricate dall'utente.

Il serving delle immagini media utilizza ETag e `If-None-Match`: se il file non è cambiato, il backend può rispondere `304 Not Modified`; se è cambiato, restituisce il nuovo contenuto. Questo evita di dover affidare l'aggiornamento delle immagini esclusivamente a parametri cache-buster.

> **Backup consigliato:** proteggi il database PostgreSQL, i file media originali e gli eventuali metadati locali (`metadata.json` e `series_metadata.json`). La cache può contenere risorse rigenerabili, ma non va considerata automaticamente sostitutiva dei dati originali.

---

## 🩺 Scansione e integrità della libreria

### Flusso di scansione

1. Il client invia `POST /library/scan`.
2. Il backend impedisce l'avvio di una seconda scansione concorrente.
3. Viene emesso `scan-started` e lo stato `isScanning` viene attivato.
4. Le directory configurate vengono esplorate ricorsivamente.
5. Il sistema calcola gli hash, rileva qualità e informazioni dai file e aggiorna i record.
6. I media non più individuati possono essere marcati come non disponibili.
7. I duplicati sono raccolti durante la scansione e salvati nei dettagli del log.
8. Al termine viene emesso `scan-completed`; il flag di scansione viene rilasciato anche in caso di errore.

### Report Health Check

Il report può includere:

- metadati mancanti e campi assenti;
- poster mancanti;
- background mancanti;
- media non disponibili;
- file rotti;
- gruppi di duplicati rilevati nell'ultima scansione completata.

Il controllo delle immagini verifica anche l'esistenza fisica del file sul disco, non soltanto la presenza di un percorso nel database.

### Duplicati: comportamento atteso

`Media.hash` è univoco nel database. Per questo motivo i duplicati sono rilevati dal processo di scansione e registrati in `ScanLog.details.duplicates`, invece di essere rappresentati come record `Media` separati con lo stesso hash.

---

## 🧑‍💻 Sviluppo e convenzioni

Le convenzioni indicate nella documentazione sono:

| Elemento | Convenzione | Esempio |
|---|---|---|
| Componenti React | PascalCase | `MediaCard`, `VideoPlayer` |
| Hook | `use` + camelCase/PascalCase secondo il contesto documentato | `useMedia`, `useWebSocket` |
| Store Zustand | camelCase + `Store` | `notificationStore` |
| Funzioni API | camelCase | `getMediaById`, `scanLibrary` |
| File di componenti | kebab-case | `video-player.tsx` |
| Configurazioni | camelCase | `genres.config.ts` |

### Linee guida operative

- Mantieni separati controller, servizi, DTO e moduli NestJS.
- Usa DTO e validazione per gli input HTTP.
- Mantieni le interazioni con PostgreSQL attraverso Prisma.
- Riutilizza i servizi condivisi di configurazione e database tramite gli appositi moduli.
- Per nuove notifiche, privilegia messaggi aggregati quando un'operazione coinvolge molti media.
- Quando modifichi i metadati di serie o episodi, rispetta le regole di ereditarietà e la natura condivisa delle cartelle degli episodi.
- Verifica che le operazioni sui file gestiscano correttamente percorsi assoluti e differenze tra sistemi operativi.

### Testing

Le specifiche identificano unit test e test d'integrazione tra le priorità di lavoro. Prima di introdurre o modificare funzionalità, verifica gli script effettivamente presenti nei package e aggiungi test coerenti con l'architettura del modulo. Non sono indicati in questa documentazione comandi di test completi e verificati per entrambe le applicazioni.

---

## 🗺️ Roadmap

### Funzionalità documentate come completate

- [x] Struttura frontend React/Vite/TypeScript e servizi API.
- [x] Libreria, dettagli media e player.
- [x] Ricerca, collezioni e “Continua a guardare”.
- [x] Notifiche in tempo reale.
- [x] Health Check e statistiche.
- [x] Datacenter, gestione categorie e film casuale.
- [x] Pagina attori con biografia e filmografia.
- [x] Guida utente e pagina Settings.
- [x] Gestione strutturata di serie, stagioni ed episodi.
- [x] Cache immagini centralizzata e fallback.
- [x] Scansione con stato realtime e rilevamento duplicati.
- [x] Modifica dei metadati di serie TV ed episodi personali.

### Attività indicate come successive

- [ ] **Ricerca full-text avanzata** con PostgreSQL (priorità alta nelle specifiche).
- [ ] **Lazy loading** delle immagini.
- [ ] **Virtual scrolling** per liste molto lunghe.
- [ ] **Unit test e test d'integrazione**.
- [ ] **PWA opzionale**, con service worker, manifest e installazione.

> Lo stato della roadmap deriva dai documenti tecnici forniti e può non riflettere eventuali modifiche successive del codice.

---

## 🧯 Risoluzione dei problemi

| Problema | Verifiche consigliate |
|---|---|
| Il backend non si connette a PostgreSQL | Controlla `DATABASE_URL`, credenziali, host, porta e disponibilità del database; verifica poi lo schema Prisma. |
| La libreria è vuota | Controlla `MEDIA_ROOTS` o la pagina Settings, i permessi sui percorsi e lo stato della scansione. |
| Un disco appare non disponibile | Verifica che il percorso sia montato e accessibile, quindi esegui una verifica della disponibilità o una nuova scansione. |
| Poster o background non si aggiornano | Controlla i percorsi della cache e i log; il serving immagini usa ETag e validazione della cache HTTP. |
| TMDB non restituisce metadati | Verifica la chiave dalla pagina Settings e controlla connettività, timeout e messaggi di validazione. |
| Gli eventi realtime non arrivano | Verifica che il backend sia attivo e che il client Socket.IO punti all'host/porta corretti. |
| La riproduzione non parte | Controlla che il file sia disponibile, che esista una versione associata e che il client usi l'endpoint player corretto. |
| Il frontend mostra errori API | Verifica il backend, la configurazione dell'URL API e la console del browser. |

Per approfondire, consulta i log della console NestJS e la tabella `NotificationLog`. Per ispezionare il database è documentato l'uso di `npx prisma studio` dalla directory backend.

---

## 🔐 Sicurezza e privacy

HomeFlix è documentato come progetto senza autenticazione. Prima di renderlo accessibile oltre la rete locale:

- aggiungi autenticazione e autorizzazione;
- limita l'accesso alle API di modifica, cancellazione, upload e gestione delle impostazioni;
- proteggi la chiave TMDB e il file `.env`;
- non versionare credenziali, database dump o contenuti multimediali privati;
- limita i percorsi media a directory intenzionalmente autorizzate;
- valuta HTTPS, firewall e restrizioni di rete;
- conserva backup verificati di database e metadati locali.

Aggiungi al `.gitignore`, se non già presenti:

```gitignore
# Segreti e configurazione locale
.env
.env.*
!.env.example

# Dipendenze e build
node_modules/
dist/
build/
coverage/

# Dati runtime e cache
.homeflix/
```

Adatta queste esclusioni alla struttura effettiva del repository: non ignorare file di esempio o asset che fanno parte del progetto.

---

## 🎬 Crediti e riferimenti

- **TMDB** — servizio esterno utilizzato per metadati e immagini: [themoviedb.org](https://www.themoviedb.org/).
- **NestJS** — [nestjs.com](https://nestjs.com/).
- **React** — [react.dev](https://react.dev/).
- **Prisma** — [prisma.io](https://www.prisma.io/).
- **PostgreSQL** — [postgresql.org](https://www.postgresql.org/).
- **Video.js** — [videojs.com](https://videojs.com/).

HomeFlix utilizza TMDB per alcuni dati e immagini, ma non è dichiarato come approvato o certificato da TMDB. Consulta i termini e le linee guida di attribuzione di TMDB prima di distribuire pubblicamente l'applicazione.

---

<div align="center">

### 🍿 La tua collezione. La tua libreria. HomeFlix.

*Documentazione generata sulla base delle specifiche tecniche e della descrizione dei moduli fornite per il progetto.*

</div>
