// src/pages/Guide.tsx
import React, { useState } from 'react';
import { Header } from '@/components/common/Header';

/* ============================================================
   TIPI
   ============================================================ */

type SectionId =
  | 'about'
  | 'startup'
  | 'scan'
  | 'metadata'
  | 'personal'
  | 'series'
  | 'player'
  | 'continue'
  | 'collections'
  | 'search'
  | 'statistics'
  | 'health'
  | 'notifications'
  | 'settings';

interface Section {
  id: SectionId;
  title: string;
  shortTitle: string;
  icon: string;
  content: React.ReactNode;
}

/* ============================================================
   CALLOUT — box colorati informativi (info / warning / success / tip)
   ============================================================ */

type CalloutVariant = 'info' | 'warning' | 'success' | 'tip';

const CALLOUT_CONFIG: Record<
  CalloutVariant,
  { bg: string; border: string; icon: string; defaultTitle: string; titleColor: string }
> = {
  info: {
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/40',
    icon: 'ℹ️',
    defaultTitle: 'Nota',
    titleColor: 'text-blue-300',
  },
  warning: {
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-500/40',
    icon: '⚠️',
    defaultTitle: 'Attenzione',
    titleColor: 'text-yellow-300',
  },
  success: {
    bg: 'bg-green-950/40',
    border: 'border-green-500/40',
    icon: '✅',
    defaultTitle: 'Buono a sapersi',
    titleColor: 'text-green-300',
  },
  tip: {
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/40',
    icon: '💡',
    defaultTitle: 'Consiglio',
    titleColor: 'text-purple-300',
  },
};

function Callout({
  variant,
  title,
  children,
}: {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const config = CALLOUT_CONFIG[variant];
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 my-4`}>
      <div className="flex gap-3">
        <span className="text-lg flex-shrink-0 leading-6">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`${config.titleColor} font-semibold text-sm mb-1`}>
            {title ?? config.defaultTitle}
          </p>
          <div className="text-sm text-hf-text-muted leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELPER — elenchi puntati e coppie chiave/valore
   ============================================================ */

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-yellow-400 flex-shrink-0 mt-0.5">•</span>
          <span className="flex-1 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function KeyValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <div className="text-hf-text-subtle text-xs uppercase tracking-wide">{label}</div>
      <div className="text-white font-semibold mt-0.5">{children}</div>
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPALE
   ============================================================ */

export function Guide() {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    about: true,
    startup: false,
    scan: false,
    metadata: false,
    personal: false,
    series: false,
    player: false,
    continue: false,
    collections: false,
    search: false,
    statistics: false,
    health: false,
    notifications: false,
    settings: false,
  });

  const [activeSection, setActiveSection] = useState<SectionId>('about');

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    setActiveSection(id);
  };

  const handleSidebarClick = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: true }));
    setActiveSection(id);
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 80);
  };

  /* ============================================================
     CONTENUTI DELLE SEZIONI
     ============================================================ */

  const sections: Section[] = [
    /* ---------------- 0. ABOUT ---------------- */
    {
      id: 'about',
      title: "Cos'è HomeFlix",
      shortTitle: 'Introduzione',
      icon: '🎬',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            <strong className="text-white">HomeFlix</strong> è una piattaforma di gestione media{' '}
            <strong className="text-white">self-hosted</strong>, progettata per l'uso personale e
            familiare. Organizza, cataloga e riproduce la tua libreria di film e serie TV
            direttamente dai tuoi dischi: senza cloud, senza abbonamenti, senza tracciamento.
          </p>

          <div className="grid grid-cols-2 gap-4 p-4 bg-hf-surface-2 rounded-lg border border-hf-border">
            <KeyValue label="Versione">
              <span className="text-green-400">2.0.0</span>
            </KeyValue>
            <KeyValue label="Data">
              <span>17 Agosto 2026</span>
            </KeyValue>
            <KeyValue label="Creatore">
              <span>Astronaut</span>
            </KeyValue>
            <KeyValue label="Licenza">
              <span>Privata</span>
            </KeyValue>
          </div>

          <div>
            <h3 className="text-white font-semibold mt-4 mb-1">I tre principi di HomeFlix</h3>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Privacy</strong> — tutti i dati rimangono sui tuoi
                  dispositivi. Nessuna autenticazione, nessun server esterno.
                </>,
                <>
                  <strong className="text-white">Performance</strong> — scansione rapida, streaming
                  ottimizzato e ricerca istantanea.
                </>,
                <>
                  <strong className="text-white">Modularità</strong> — architettura a moduli
                  indipendenti: ogni componente è sostituibile senza impatti sugli altri.
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mt-4 mb-1">Stack tecnologico</h3>
            <p className="text-sm">
              <span className="text-white font-medium">Frontend:</span> React 18, TypeScript 5,
              Vite, Tailwind CSS, React Query, Zustand, Video.js, Socket.IO Client.
            </p>
            <p className="text-sm mt-1">
              <span className="text-white font-medium">Backend:</span> NestJS 10, Prisma 5,
              PostgreSQL 15, Socket.IO, integrazione API TMDB.
            </p>
          </div>

          <Callout variant="info" title="Cosa NON fa HomeFlix">
            HomeFlix non scarica, non distribuisce e non condivide contenuti. Tutto ciò che vedi
            nella libreria è già presente sui tuoi dischi: il software si limita a organizzarli,
            arricchirli con metadati e riprodurli nel browser. Non esistono funzionalità
            multiutente, login o invio di dati a server remoti (eccetto le chiamate a TMDB per i
            metadati).
          </Callout>
        </div>
      ),
    },

    /* ---------------- 1. PRIMO AVVIO ---------------- */
    {
      id: 'startup',
      title: '1. Primo avvio e configurazione',
      shortTitle: 'Primo avvio',
      icon: '🚀',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Prima di poter usare HomeFlix è necessario indicare{' '}
            <strong className="text-white">dove si trovano i tuoi file multimediali</strong>.
            Questa configurazione si effettua dalla pagina{' '}
            <span className="text-white">Impostazioni</span>, accessibile dal menu di navigazione
            in alto.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Passaggi consigliati al primo avvio</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside marker:text-yellow-400">
              <li>
                Apri la pagina <span className="text-white">Impostazioni</span>.
              </li>
              <li>
                Nella sezione <span className="text-white">Percorsi dei dischi</span>, inserisci
                uno o più percorsi assoluti (es. <code>E:/Film</code>, <code>D:/SerieTv</code>).
              </li>
              <li>
                (Facoltativo) Inserisci la tua <span className="text-white">chiave API TMDB</span>{' '}
                per abilitare il download automatico di trame, poster e cast.
              </li>
              <li>
                Torna alla <span className="text-white">Home</span> e premi il pulsante{' '}
                <span className="text-yellow-400 font-medium">Scansiona</span> nell'header.
              </li>
            </ol>
          </div>

          <Callout variant="warning" title="Percorsi assoluti e accessibili">
            I percorsi devono essere <strong>assoluti</strong> (es. <code>E:/Film</code>,{' '}
            <code>/mnt/nas/media</code>) e la cartella deve essere leggibile dal processo backend.
            Le unità di rete e i NAS vanno montati sul sistema operativo <em>prima</em> di avviare
            HomeFlix.
          </Callout>

          <Callout variant="info" title="Chiave API TMDB — funzionalità in arrivo">
            La gestione della chiave API TMDB dalla pagina Impostazioni è attualmente in fase di
            completamento lato backend. Fino al rilascio definitivo, la chiave può essere
            configurata manualmente nel file <code>.env</code> del backend (variabile{' '}
            <code>TMDB_API_KEY</code>). In assenza di chiave, HomeFlix funziona comunque
            utilizzando metadati locali o immagini di default.
          </Callout>

          <Callout variant="tip">
            Organizza le cartelle in modo coerente (una cartella per film, una per serie TV con
            sottocartelle per stagione): la scansione riconoscerà i contenuti in modo più accurato
            e sarà più semplice gestirli in seguito.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 2. SCANSIONE ---------------- */
    {
      id: 'scan',
      title: '2. Scansione della libreria',
      shortTitle: 'Scansione',
      icon: '🔍',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            La <strong className="text-white">scansione</strong> è il processo con cui HomeFlix
            analizza le cartelle configurate, indicizza i file video e aggiorna il database. Puoi
            avviarla in qualsiasi momento dal pulsante{' '}
            <span className="text-yellow-400 font-medium">Scansiona</span> nell'header.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Cosa fa la scansione</h3>
            <BulletList
              items={[
                'Analizza ricorsivamente tutte le sottocartelle dei percorsi configurati.',
                'Calcola un hash univoco per ogni file video (identifica il contenuto reale).',
                'Estrae la qualità dal nome del file (es. 1080p, 4K, 720p).',
                'Riconosce il titolo pulito rimuovendo anno, qualità e caratteri speciali.',
                'Riconosce serie TV tramite pattern come S01E01 o 1x01.',
                'Aggiorna il database con nuovi contenuti e aggiorna quelli esistenti.',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">La barra di scansione</h3>
            <p className="text-sm">
              Durante la scansione, sotto l'header compare una{' '}
              <strong className="text-white">barra animata</strong> con un fascio di luce dorato.
              La barra scompare automaticamente al termine. Se ricarichi la pagina mentre è in
              corso una scansione, la barra riappare grazie alla sincronizzazione con il backend.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Duplicati</h3>
            <p className="text-sm">
              Se lo stesso file (stesso contenuto) è presente in più cartelle o su dischi diversi,
              HomeFlix lo rileva tramite l'hash e crea{' '}
              <strong className="text-white">un solo record</strong> nel database. Il primo file
              incontrato diventa quello di riferimento; gli altri vengono tracciati e segnalati
              alla fine della scansione con un warning aggregato.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Disponibilità dei file</h3>
            <p className="text-sm">
              Alla fine di ogni scansione, HomeFlix marca come <code>available: false</code> tutti
              i media che <strong className="text-white">non sono stati ritrovati</strong>{' '}
              (tipicamente perché il disco è stato scollegato). Tali contenuti restano visibili in
              libreria ma vengono segnalati come non disponibili e il pulsante <em>Play</em>{' '}
              risulta disabilitato. Ricollegando il disco e riavviando una scansione, la
              disponibilità viene ripristinata automaticamente.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Notifiche a fine scansione</h3>
            <p className="text-sm">
              Per evitare spam, HomeFlix <strong className="text-white">non invia una notifica per
              ogni file</strong>. Al termine emette solo notifiche aggregate:
            </p>
            <BulletList
              items={[
                <>
                  <span className="text-green-400 font-medium">Successo</span> — riepilogo con
                  conteggi (nuovi, aggiornati).
                </>,
                <>
                  <span className="text-white font-medium">Dettaglio</span> — lista verticale con
                  i titoli aggiunti/aggiornati.
                </>,
                <>
                  <span className="text-yellow-400 font-medium">Warning</span> — media senza
                  metadati TMDB (se presenti).
                </>,
                <>
                  <span className="text-yellow-400 font-medium">Warning</span> — errori di
                  scansione (se presenti).
                </>,
                <>
                  <span className="text-yellow-400 font-medium">Warning</span> — N duplicati
                  rilevati (se presenti).
                </>,
              ]}
            />
          </div>

          <Callout variant="warning" title="Una scansione alla volta">
            Il backend rifiuta scansioni concorrenti: se una è già in corso, il pulsante{' '}
            <em>Scansiona</em> resta disabilitato finché non termina. Questa protezione evita
            duplicazioni e possibili inconsistenze nei dati.
          </Callout>

          <Callout variant="success" title="Quando è tutto a posto">
            Se al termine della scansione ricevi solo la notifica di successo (nessun warning),
            significa che la libreria è perfettamente allineata: metadati completi, immagini
            presenti, nessun file mancante.
          </Callout>

          <Callout variant="tip">
            Puoi avviare una scansione da qualsiasi dispositivo connesso: tutti i client
            riceveranno l'evento in tempo reale e vedranno la barra animata.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 3. METADATI ---------------- */
    {
      id: 'metadata',
      title: '3. Metadati e immagini',
      shortTitle: 'Metadati',
      icon: '🎨',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Dopo la scansione, HomeFlix arricchisce ogni contenuto con{' '}
            <strong className="text-white">metadati</strong> e immagini recuperati dall'API di
            TMDB: trama, poster, sfondo, cast, trailer, anno, rating e generi. Se TMDB non è
            raggiungibile (o la chiave API non è configurata), il sistema ricade su metadati locali
            o immagini di default.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Dove vengono salvate le immagini</h3>
            <p className="text-sm">
              Tutte le immagini sono salvate in una{' '}
              <strong className="text-white">cache centralizzata</strong>, indipendente dalla
              posizione originale dei file video. Questo permette di spostare o rinominare le
              cartelle senza perdere le immagini associate.
            </p>
            <BulletList
              items={[
                <>
                  Poster dei film: <code>.homeflix/cache/media/poster/&lt;mediaId&gt;.jpg</code>
                </>,
                <>
                  Sfondo dei film:{' '}
                  <code>.homeflix/cache/media/background/&lt;mediaId&gt;.jpg</code>
                </>,
                <>
                  Poster delle serie: <code>series_&lt;seriesId&gt;.jpg</code> (stesse cartelle)
                </>,
                <>
                  Immagini degli attori: <code>.homeflix/cache/actors/</code>
                </>,
                <>
                  Metadati degli attori: <code>.homeflix/cache/metadata/actors/</code>
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Il file metadata.json</h3>
            <p className="text-sm">
              Per i <strong className="text-white">film</strong>, HomeFlix scrive un file{' '}
              <code>metadata.json</code> direttamente nella cartella del film. È un dato
              considerato <em>primario e non rigenerabile</em>: se elimini la cache, il file ti
              permette di ricostruire i metadati senza doverli riscaricare da TMDB.
            </p>
            <p className="text-sm mt-2">
              Per gli <strong className="text-white">episodi</strong> delle serie TV, invece, il
              file non viene creato: la cartella è condivisa da più episodi, quindi i metadati
              vivono solo nel database.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Fallback automatico</h3>
            <p className="text-sm">
              Se TMDB non è raggiungibile o una serie non ha poster/sfondo validi, HomeFlix
              applica automaticamente le immagini di default (<code>poster.jpg</code> e{' '}
              <code>background.jpg</code> dalla cartella <code>public/assets/default</code>). Le
              card delle stagioni in home e la pagina di dettaglio serie restano quindi sempre
              correttamente visibili.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Attori</h3>
            <p className="text-sm">
              Gli attori vengono salvati sia in <code>Media.actors</code> (per i film e gli
              episodi) sia in <code>Series.actors</code> (una sola volta per serie TV). Una
              garbage collection periodica elimina le immagini degli attori non più referenziati,
              tenendo conto di entrambe le tabelle.
            </p>
          </div>

          <Callout variant="info" title="API Key mancante">
            Se la chiave API TMDB non è configurata, HomeFlix invia un warning una sola volta per
            sessione: le funzionalità di base (scansione, streaming, organizzazione) restano
            pienamente operative, ma i metadati resteranno quelli locali o di default.
          </Callout>

          <Callout variant="success" title="Cache intelligente">
            Le immagini vengono scaricate una sola volta e riutilizzate in tutte le pagine: la
            navigazione resta veloce anche con librerie molto grandi.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 4. VIDEO PERSONALI ---------------- */
    {
      id: 'personal',
      title: '4. Video Personali e Metadati Manuali',
      shortTitle: 'Video Personali',
      icon: '🎥',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            HomeFlix non gestisce solo film e serie TV commerciali: puoi aggiungere alla tua
            libreria anche <strong className="text-white">video personali</strong> — filmati di
            famiglia, documentari amatoriali, riprese di viaggi, materiali di studio o di lavoro.
            Questi contenuti vengono trattati come film, ma{' '}
            <strong className="text-white">non hanno alcuna corrispondenza su TMDB</strong>:
            senza intervento manuale, apparirebbero quindi con poster e sfondo di default, trama
            generica e nessuna informazione aggiuntiva.
          </p>

          <p className="text-sm leading-relaxed">
            Per arricchirli, HomeFlix mette a disposizione una{' '}
            <strong className="text-white">scheda di modifica integrata</strong>, accessibile
            direttamente dalla pagina del video. Tutto avviene dall'interfaccia: nessun file da
            modificare a mano, nessun editor esterno.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Come riconoscere un video personale</h3>
            <p className="text-sm">
              Apri il dettaglio del contenuto: sotto al titolo, accanto agli altri badge, troverai
              uno di questi indicatori:
            </p>
            <BulletList
              items={[
                <>
                  <span className="text-green-500 font-medium">✓ TMDB</span> — il contenuto è
                  stato arricchito automaticamente da TMDB (film commerciale).
                </>,
                <>
                  <span className="text-blue-400 font-medium">✓ Locale</span> — i metadati sono
                  stati personalizzati manualmente da te.
                </>,
                <>
                  <em>Nessun badge</em> — il contenuto usa metadati di default: è candidato ideale
                  per la scheda di modifica.
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Il pulsante "✏️ Modifica Metadati"</h3>
            <p className="text-sm">
              Nella pagina di dettaglio di un video personale compare, sotto ai pulsanti{' '}
              <em>Play</em> e <em>Trailer</em>, un nuovo pulsante giallo{' '}
              <strong className="text-white">"✏️ Modifica Metadati"</strong>. Il pulsante è
              visibile <strong className="text-white">solo per i film non-TMDB</strong>: non
              compare sui contenuti già arricchiti automaticamente, né sugli episodi di serie TV
              (per i quali i metadati si gestiscono a livello di serie).
            </p>
            <p className="text-sm mt-2">
              Cliccandolo si apre una scheda a comparsa, precompilata con i valori attuali del
              contenuto. Il pulsante stesso si trasforma in <em>"✕ Chiudi scheda"</em> per
              richiudere il pannello senza salvare.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Cosa puoi compilare nella scheda</h3>
            <p className="text-sm">
              La scheda ricalca esattamente i campi del file <code>metadata.json</code> che
              HomeFlix usa come dato primario. Ogni campo è facoltativo tranne il titolo:
            </p>
            <div className="overflow-x-auto -mx-2 px-2 mt-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-hf-text-subtle text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4 font-semibold">Campo</th>
                    <th className="text-left py-2 font-semibold">Descrizione</th>
                  </tr>
                </thead>
                <tbody className="text-hf-text-muted">
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Titolo *</td>
                    <td className="py-2">Obbligatorio. È il nome mostrato in tutta l'app.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Titolo originale</td>
                    <td className="py-2">Nome effettivo del contenuto, se diverso.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Trama</td>
                    <td className="py-2">Descrizione testuale del video.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Durata / Anno</td>
                    <td className="py-2">Minuti e anno di uscita.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Rating / Oscar</td>
                    <td className="py-2">Voto (0–10) e numero di premi.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Regia / Paese / Lingua</td>
                    <td className="py-2">Informazioni sulla produzione.</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Incasso</td>
                    <td className="py-2">Valore in dollari (facoltativo).</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Generi</td>
                    <td className="py-2">
                      Selezione multipla tramite chip (Azione, Dramma, Documentario, ecc.). Il
                      contenuto comparirà automaticamente in tutte le categorie selezionate in
                      home.
                    </td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Attori</td>
                    <td className="py-2">
                      Tag input: scrivi un nome, premi <kbd>Enter</kbd>, il nome diventa un chip
                      cliccabile. Ogni attore è poi navigabile dalla sua pagina dedicata.
                    </td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">Trailer / Logo URL</td>
                    <td className="py-2">Link facoltativi a trailer esterni o logo.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Immagini personalizzate</h3>
            <p className="text-sm">
              Nella scheda trovi due riquadri separati per{' '}
              <strong className="text-white">Poster</strong> e{' '}
              <strong className="text-white">Background</strong>. Ciascuno mostra l'immagine
              attualmente in uso; premendo il pulsante giallo sottostante puoi scegliere un file
              dal tuo computer. L'anteprima si aggiorna immediatamente per mostrarti come
              apparirà.
            </p>
            <BulletList
              items={[
                'Formati supportati: JPG, PNG, WebP, GIF, BMP.',
                'Dimensione massima: 10 MB per immagine.',
                "L'estensione originale viene mantenuta: un PNG resta PNG (con la sua trasparenza).",
                'Le immagini precedenti con estensioni diverse vengono eliminate automaticamente.',
                'Le immagini vengono salvate nella cache centralizzata, non nella cartella del video.',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Cosa succede quando salvi</h3>
            <p className="text-sm">
              Premendo <strong className="text-white">"💾 Salva Metadati"</strong>, HomeFlix esegue
              in sequenza:
            </p>
            <BulletList
              items={[
                <>
                  Aggiorna il <strong className="text-white">database</strong> con tutti i campi
                  testuali.
                </>,
                <>
                  Carica le eventuali <strong className="text-white">nuove immagini</strong> nella
                  cache e aggiorna i percorsi nel DB.
                </>,
                <>
                  Riscrive il file <code>metadata.json</code> nella cartella del video,
                  mantenendolo allineato al database.
                </>,
                <>
                  Imposta <code>metadataSource</code> su <strong className="text-white">local</strong>
                  : da questo momento in poi, il contenuto non verrà più toccato da TMDB.
                </>,
                <>
                  Aggiorna automaticamente l'interfaccia: titolo, poster, sfondo, cast e generi
                  vengono ricaricati senza dover ricaricare la pagina.
                </>,
              ]}
            />
            <p className="text-sm mt-2">
              Al termine ricevi una notifica verde di conferma e la scheda si richiude. Il
              pulsante "✏️ Modifica Metadati" resta visibile per permetterti di tornare a
              modificare i dati in qualsiasi momento.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Perché è importante il file metadata.json</h3>
            <p className="text-sm">
              Il file <code>metadata.json</code> che HomeFlix scrive nella cartella del video è
              una <strong className="text-white">copia ridondante ma preziosa</strong> dei dati
              che hai inserito: se un domani dovessi reinstallare HomeFlix, spostare la libreria o
              ricostruire il database, il file ti permette di recuperare tutte le informazioni
              senza doverle reinserire a mano. È la stessa strategia che HomeFlix usa per i film
              commerciali: il database è la fonte operativa, il file è la fonte storica.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Cosa NON è possibile fare</h3>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Modificare episodi di serie TV</strong> — la
                  cartella è condivisa da più episodi: i metadati si gestiscono a livello di
                  serie/stagione, non di singolo episodio.
                </>,
                <>
                  <strong className="text-white">Cambiare il tipo di contenuto</strong> — un
                  video riconosciuto come film resta un film. Se un file viene erroneamente
                  classificato come episodio di serie TV, rinominalo rimuovendo il pattern{' '}
                  <code>S01E01</code> o <code>1x01</code> e riavvia la scansione.
                </>,
                <>
                  <strong className="text-white">Ripristinare i metadati TMDB</strong> — una volta
                  che un contenuto è marcato come <em>local</em>, non esiste un pulsante "Riprova
                  TMDB". Il contenuto resterà sempre personalizzato: se vuoi tornare indietro,
                  elimina il film e riavvia la scansione.
                </>,
              ]}
            />
          </div>

          <Callout variant="tip" title="Il pulsante si vede solo dove serve">
            Se non vedi il pulsante "✏️ Modifica Metadati", significa che quel contenuto è già
            stato arricchito automaticamente da TMDB, oppure che stai guardando un episodio. Solo
            i film senza corrispondenza TMDB mostrano la scheda di modifica.
          </Callout>

          <Callout variant="success" title="Niente più file JSON a mano">
            Non serve più aprire, modificare e risalvare il file <code>metadata.json</code> con un
            editor di testo: la scheda integrata scrive automaticamente tutto quello che serve,
            con validazione dei campi e anteprima delle immagini.
          </Callout>

          <Callout variant="info" title="Aggiornamento immediato delle immagini">
            Quando carichi un nuovo poster o sfondo, HomeFlix aggiorna l'immagine in tutte le
            pagine (Home, categorie, "Continua a guardare", ecc.) senza che tu debba svuotare la
            cache del browser: il backend invalida automaticamente la versione precedente.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 5. SERIE TV ---------------- */
    {
      id: 'series',
      title: '5. Serie TV e navigazione episodi',
      shortTitle: 'Serie TV',
      icon: '📺',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            HomeFlix riconosce automaticamente le serie TV analizzando i{' '}
            <strong className="text-white">nomi dei file</strong>, non quelli delle cartelle.
            Questo permette di organizzare la libreria in modo flessibile: la cartella padre può
            contenere episodi di stagioni diverse, oppure più serie, senza problemi.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Formati riconosciuti</h3>
            <BulletList
              items={[
                <>
                  <code>NomeSerie.S01E01.TitoloEpisodio.mkv</code> — pattern standard.
                </>,
                <>
                  <code>NomeSerie.1x01.TitoloEpisodio.mkv</code> — pattern alternativo.
                </>,
                <>
                  <code>NomeSerie.4x03.mkv</code> — anche senza titolo episodio.
                </>,
              ]}
            />
            <p className="text-sm mt-2">
              Il <strong className="text-white">titolo della serie</strong> viene estratto dalla
              parte iniziale del filename; il numero di stagione/episodio dai marcatori S/E o NxN.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Come sono organizzate le serie TV</h3>
            <BulletList
              items={[
                <>
                  In home, la sezione <strong className="text-white">Serie TV</strong> mostra una
                  card per <em>stagione</em> (non per serie).
                </>,
                <>
                  La card mostra il poster della serie con badge <code>S&lt;n&gt;</code> in alto e{' '}
                  <code>N ep</code> in basso.
                </>,
                <>
                  Cliccando la card si apre la pagina{' '}
                  <strong className="text-white">Dettaglio Stagione</strong> con la lista completa
                  degli episodi.
                </>,
                <>
                  Ogni episodio mostra: still, badge <code>E&lt;num&gt;</code>, titolo, durata,
                  trama e pulsanti Play/Dettagli.
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Pagina episodio</h3>
            <p className="text-sm">
              La pagina di dettaglio di un episodio riutilizza lo stesso layout dei film, con
              alcune differenze:
            </p>
            <BulletList
              items={[
                'In alto compare il pulsante "← Torna alla stagione" con nome serie e numero stagione.',
                <>
                  Il titolo principale è <code>originalTitle</code> dell'episodio (nome effettivo),
                  con il titolo episodio come sottotitolo.
                </>,
                <>Un badge giallo mostra "STAGIONE X · EPISODIO Y".</>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Navigazione tra episodi nel player</h3>
            <p className="text-sm">
              Durante la riproduzione di un episodio, in overlay compaiono due pulsanti{' '}
              <strong className="text-white">Precedente</strong> e{' '}
              <strong className="text-white">Successivo</strong>, con etichetta{' '}
              <code>SxxExx</code>. Sono disabilitati ai bordi della serie (primo episodio →
              niente precedente, ultimo → niente successivo).
            </p>
            <p className="text-sm mt-2">
              Quando un episodio termina, se è abilitato l'autoplay, dopo circa 600 ms HomeFlix
              passa automaticamente al successivo. Se il nuovo episodio era già in "Continua a
              guardare", la riproduzione riparte dall'ultimo secondo salvato; altrimenti
              dall'inizio.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Eliminazione di un episodio</h3>
            <p className="text-sm">
              Se elimini l'<strong className="text-white">ultimo episodio</strong> di una serie,
              HomeFlix elimina automaticamente anche le immagini della serie (
              <code>series_&lt;id&gt;.jpg</code>) e la riga <code>Series</code> dal database. Gli
              altri episodi restano intatti.
            </p>
          </div>

          <Callout variant="tip">
            Per ottenere il miglior riconoscimento, assegna ai file un nome pulito e coerente: i
            pattern <code>S01E01</code> sono più affidabili di <code>1x01</code>, e includere il
            titolo dell'episodio dopo il numero migliora la qualità dei metadati.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 6. PLAYER ---------------- */
    {
      id: 'player',
      title: '6. Player e streaming',
      shortTitle: 'Player',
      icon: '▶️',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Il player integrato è basato su <strong className="text-white">Video.js</strong> e
            supporta selezione della qualità, sottotitoli, tracce audio multiple e ripresa
            automatica della riproduzione. Lo streaming avviene direttamente dal backend, con
            supporto completo agli header HTTP <code>Range</code> per lo <em>seeking</em> fluido.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Funzionalità principali</h3>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Qualità multipla</strong> — se disponibili più
                  versioni dello stesso contenuto (es. 4K, 1080p, 720p), un menu a tendina
                  permette di sceglierle.
                </>,
                <>
                  <strong className="text-white">Sottotitoli</strong> — supporto per file{' '}
                  <code>.srt</code> e <code>.vtt</code> associati al video.
                </>,
                <>
                  <strong className="text-white">Tracce audio</strong> — selezione della lingua
                  quando il file contiene più tracce.
                </>,
                <>
                  <strong className="text-white">Ripresa automatica</strong> — il player riparte
                  dall'ultimo secondo salvato, se presente.
                </>,
                <>
                  <strong className="text-white">Autoplay episodio successivo</strong> — al
                  termine di un episodio, passa automaticamente al successivo (se disponibile).
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Formati supportati</h3>
            <p className="text-sm">
              MKV, MP4, AVI, MOV, WEBM. La compatibilità di riproduzione dipende dal browser: MKV
              e alcuni codec potrebbero richiedere l'uso di un browser specifico
              (Chrome/Edge/Firefox recenti consigliati).
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Contenuto non disponibile</h3>
            <p className="text-sm">
              Se il file video non è raggiungibile (disco scollegato), il pulsante <em>Play</em> è
              disabilitato e la pagina mostra un banner di avviso. Il messaggio suggerisce di
              ricollegare il disco e avviare una nuova scansione.
            </p>
          </div>

          <Callout variant="info">
            Il player richiede che il backend sia raggiungibile. Se navighi da un dispositivo
            diverso dal computer che ospita il server, assicurati che la rete locale sia
            configurata correttamente.
          </Callout>

          <Callout variant="tip">
            Se lo streaming si interrompe frequentemente, verifica la stabilità della connessione
            (soprattutto con NAS) e prova a ridurre la qualità dal menu del player.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 7. CONTINUA A GUARDARE ---------------- */
    {
      id: 'continue',
      title: '7. Continua a guardare',
      shortTitle: 'Continua a guardare',
      icon: '⏱️',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            La sezione <strong className="text-white">Continua a guardare</strong> in home
            raccoglie i contenuti che hai iniziato ma non completato, permettendoti di riprendere
            esattamente da dove eri rimasto.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Quando viene salvato il progresso</h3>
            <BulletList
              items={[
                'Ogni 5 secondi durante la riproduzione.',
                'Quando metti in pausa il video.',
                'Alla chiusura del player.',
                'Al termine del video (100%).',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Regole di salvataggio</h3>
            <p className="text-sm">
              Il progresso viene salvato solo quando la percentuale è compresa tra il{' '}
              <strong className="text-white">2% e l'85%</strong>:
            </p>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Sotto il 2%</strong> — il contenuto è considerato
                  "non ancora iniziato": nessun salvataggio.
                </>,
                <>
                  <strong className="text-white">Tra il 2% e l'85%</strong> — compare in "Continua
                  a guardare" con barra di progresso e minuti rimanenti.
                </>,
                <>
                  <strong className="text-white">Oltre l'85%</strong> — il contenuto è considerato
                  completato: viene rimosso dalla sezione.
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Badge per gli episodi</h3>
            <p className="text-sm">
              Per gli episodi di serie TV, la card mostra un badge <code>S04E03</code> in alto a
              sinistra, il nome della serie come titolo principale e il titolo dell'episodio come
              sottotitolo. Il click riprende direttamente l'episodio dall'ultimo secondo salvato.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Conteggio visioni</h3>
            <p className="text-sm">
              Quando un contenuto supera la soglia dell'85%, HomeFlix incrementa di 1 il contatore
              delle visioni (<code>viewCount</code>). Questo dato alimenta le statistiche: "Film
              più visti", "Ore totali guardate" e "Generi preferiti".
            </p>
          </div>

          <Callout variant="info">
            La sezione mostra al massimo <strong>10 contenuti</strong>, ordinati per data di
            visualizzazione più recente.
          </Callout>

          <Callout variant="success">
            Se un contenuto scompare da "Continua a guardare", è probabile che tu l'abbia
            completato (oltre l'85%) oppure che tu non l'abbia avviato abbastanza a lungo (sotto
            il 2%).
          </Callout>
        </div>
      ),
    },

    /* ---------------- 8. COLLEZIONI ---------------- */
    {
      id: 'collections',
      title: '8. Collezioni personalizzate',
      shortTitle: 'Collezioni',
      icon: '📚',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Le <strong className="text-white">collezioni</strong> ti permettono di raggruppare
            film e serie a piacere, indipendentemente dal genere o dall'anno: ad esempio "Film di
            Natale", "Maratona Thriller", "Da rivedere", "Serie cult".
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Creare una collezione</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside marker:text-yellow-400">
              <li>
                Apri la pagina <strong className="text-white">Collezioni</strong> dal menu.
              </li>
              <li>
                Premi <strong className="text-white">+ Nuova collezione</strong>.
              </li>
              <li>Assegna un nome (e, se vuoi, una descrizione).</li>
              <li>Apri la collezione e aggiungi film/serie dalla libreria.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Immagini personalizzate</h3>
            <p className="text-sm">
              Per ogni collezione puoi caricare un <strong className="text-white">poster</strong> e
              uno <strong className="text-white">sfondo</strong> personalizzati. I formati
              supportati sono JPG, PNG, GIF e WebP, con limite di 5 MB per immagine. Le immagini
              vengono salvate in <code>.homeflix/cache/collections/</code>.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Aggiungere e rimuovere contenuti</h3>
            <p className="text-sm">
              Nella pagina di dettaglio della collezione trovi l'elenco dei contenuti già inseriti
              e un pannello per aggiungerne di nuovi. Ogni elemento può essere rimosso
              singolarmente senza intaccare la libreria principale.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">In home</h3>
            <p className="text-sm">
              Le collezioni esistenti compaiono in una sezione dedicata della home ("Le mie
              Collezioni"), con un'anteprima dei contenuti e un link diretto alla pagina completa.
            </p>
          </div>

          <Callout variant="warning" title="Eliminazione di una collezione">
            Eliminando una collezione vengono rimosse automaticamente anche le immagini caricate
            dalla cache e tutti i riferimenti ai contenuti (senza toccare i film/serie originali).
          </Callout>
        </div>
      ),
    },

    /* ---------------- 9. RICERCA E NAVIGAZIONE ---------------- */
    {
      id: 'search',
      title: '9. Ricerca, categorie e navigazione',
      shortTitle: 'Ricerca',
      icon: '🧭',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            HomeFlix offre diversi strumenti per esplorare la libreria: ricerca globale, categorie
            per genere, pagina Datacenter, sezione attori e film casuale.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Ricerca globale</h3>
            <p className="text-sm">
              La barra di ricerca nell'header (visibile in ogni pagina) cerca per{' '}
              <strong className="text-white">titolo, attore o regista</strong>. I risultati
              aggregano automaticamente gli episodi in serie: nei risultati compare una sola card
              per serie invece di una per episodio, con il numero di stagioni disponibili.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Categorie e generi</h3>
            <p className="text-sm">
              La home e la pagina <code>/genre</code> mostrano{' '}
              <strong className="text-white">tutte le categorie TMDB</strong> più alcune categorie
              speciali (es. "Musica - Concerti Live"). Cliccando su una categoria si apre la
              griglia dedicata con tutti i contenuti corrispondenti.
            </p>
            <p className="text-sm mt-2">
              La categoria <strong className="text-white">Serie TV</strong> è particolare: il
              conteggio e la griglia si riferiscono alle <em>stagioni</em>, non agli episodi. Ogni
              card rappresenta una stagione completa.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Film casuale</h3>
            <p className="text-sm">
              Il pulsante <strong className="text-white">Casuale</strong> nell'header sceglie un
              contenuto a caso dalla libreria. Per i film apre direttamente la pagina di dettaglio;
              per le serie TV apre la prima stagione disponibile. Sono esclusi i contenuti non
              disponibili.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Datacenter</h3>
            <p className="text-sm">
              La pagina <strong className="text-white">Datacenter</strong> offre una vista
              tabellare completa di tutta la libreria (film + episodi), con:
            </p>
            <BulletList
              items={[
                'Ricerca testuale per titolo.',
                'Ordinamento per titolo, anno, genere, data di aggiunta o disponibilità.',
                'Indicatori di disponibilità (verde/rosso).',
                'Pulsante "Apri" per navigare al dettaglio.',
                'Pulsante "Elimina" per rimuovere un contenuto dal database.',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Pagina attore</h3>
            <p className="text-sm">
              Cliccando il nome di un attore (da film, episodi o stagioni) si apre la sua pagina
              dedicata con:
            </p>
            <BulletList
              items={[
                'Banner con la bandiera del paese di origine.',
                'Foto profilo, nome e informazioni personali (nascita, luogo, eventuale morte).',
                'Biografia richiudibile (mostra di più/meno).',
                'Filmografia completa, divisa in film e serie TV.',
              ]}
            />
          </div>

          <Callout variant="tip">
            Usa la ricerca globale per trovare rapidamente un attore: puoi digitare solo il cognome
            e ottenere tutti i contenuti correlati.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 10. STATISTICHE ---------------- */
    {
      id: 'statistics',
      title: '10. Statistiche',
      shortTitle: 'Statistiche',
      icon: '📊',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            La pagina <strong className="text-white">Statistiche</strong> offre una panoramica del
            tuo consumo di contenuti: quante ore hai guardato, cosa hai visto più spesso e quali
            generi preferisci.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Ore totali guardate</h3>
            <p className="text-sm">
              Calcolate come <code>Σ (viewCount × runtime)</code> per le visioni completate, più
              il progresso delle visioni ancora in corso. Questo fornisce un dato reale del tempo
              effettivamente trascorso a guardare contenuti.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Film più visti</h3>
            <p className="text-sm">
              Elenco dei contenuti visti più di una volta, ordinati per numero di visioni. Il podio
              (top 3) è decorato con medaglie 🥇🥈🥉. Ogni card è cliccabile e porta al dettaglio
              del contenuto. Massimo <strong className="text-white">4 film</strong> mostrati.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Generi preferiti</h3>
            <p className="text-sm">
              Grafico a barre verticali con i generi più rappresentati nella tua cronologia. Il
              peso di ogni genere è dato dal numero di visioni (o 1 per contenuti ancora in corso).
              Le barre sono grigie e diventano dorate al passaggio del mouse.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Guardati di recente</h3>
            <p className="text-sm">
              Gli ultimi <strong className="text-white">6 contenuti</strong> visualizzati,
              ordinati per data. Nessuna scrollbar: la griglia si adatta automaticamente.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Aggiornamento automatico</h3>
            <p className="text-sm">
              La pagina si aggiorna automaticamente ogni volta che ci entri, senza bisogno di
              pulsanti "Aggiorna". I dati sono sempre freschi.
            </p>
          </div>

          <Callout variant="warning" title="Azzeramento delle statistiche">
            Nella card "Ore totali guardate" è presente il pulsante{' '}
            <strong>Azzera Statistiche</strong>. L'operazione è irreversibile: elimina tutta la
            cronologia delle visioni e azzera il contatore <code>viewCount</code> di tutti i
            contenuti. Ti verrà chiesta conferma prima di procedere.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 11. HEALTH CHECK ---------------- */
    {
      id: 'health',
      title: '11. Health Check — Integrità libreria',
      shortTitle: 'Health Check',
      icon: '🩺',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            La pagina <strong className="text-white">Health Check</strong> analizza la libreria e
            segnala eventuali problemi: metadati incompleti, immagini mancanti, file non
            raggiungibili o duplicati. È lo strumento di diagnostica principale per mantenere la
            libreria in ordine.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Le 5 card di riepilogo</h3>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Totale Film</strong> — numero complessivo di
                  contenuti.
                </>,
                <>
                  <strong className="text-yellow-400">Metadati Mancanti</strong> — contenuti a cui
                  mancano uno o più campi (trama, rating, generi, regista, anno).
                </>,
                <>
                  <strong className="text-yellow-400">Poster Mancanti</strong> — file poster
                  assente fisicamente su disco.
                </>,
                <>
                  <strong className="text-yellow-400">Background Mancanti</strong> — file
                  background assente fisicamente su disco.
                </>,
                <>
                  <strong className="text-red-400">Non Disponibili</strong> — media con file video
                  assente (dischi scollegati).
                </>,
              ]}
            />
            <p className="text-sm mt-2">
              Ogni card è <strong className="text-white">cliccabile</strong>: si apre un pannello
              con l'elenco dettagliato dei media interessati (titolo, tipo, ID, path DB, campi
              mancanti).
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Sezioni espandibili</h3>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Duplicati</strong> — gruppi di file identici
                  (stesso hash) presenti in più cartelle o dischi. Ogni gruppo mostra l'hash e
                  l'elenco completo dei file.
                </>,
                <>
                  <strong className="text-white">File Rotti</strong> — media il cui file video non
                  è raggiungibile o è danneggiato.
                </>,
              ]}
            />
            <p className="text-sm mt-2">
              Le liste con più di 5 elementi mostrano una scrollbar interna per non appesantire la
              pagina.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Aggiornamento automatico</h3>
            <p className="text-sm">
              Il report <strong className="text-white">non ha un pulsante "Aggiorna"</strong>: si
              aggiorna automaticamente al termine di ogni scansione della libreria, tramite
              l'evento WebSocket <code>scan-completed</code>.
            </p>
          </div>

          <Callout variant="info">
            Se una card mostra un numero alto, clicca per vedere i dettagli: spesso bastano un paio
            di azioni mirate (ricollegare un disco, avviare una scansione, aggiornare i metadati)
            per risolvere.
          </Callout>

          <Callout variant="tip">
            Controlla periodicamente l'Health Check dopo aver aggiunto nuovi contenuti o spostato
            file: ti aiuta a individuare subito contenuti orfani o duplicati.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 12. NOTIFICHE ---------------- */
    {
      id: 'notifications',
      title: '12. Notifiche in tempo reale',
      shortTitle: 'Notifiche',
      icon: '🔔',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            HomeFlix invia <strong className="text-white">notifiche in tempo reale</strong> per
            gli eventi importanti: fine scansione, aggiornamento metadati, errori di rete,
            problemi di connessione. Le notifiche compaiono in alto a destra, sotto l'header.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">I 6 tipi di notifica</h3>
            <div className="overflow-x-auto -mx-2 px-2 mt-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-hf-text-subtle text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4 font-semibold">Tipo</th>
                    <th className="text-left py-2 pr-4 font-semibold">Colore</th>
                    <th className="text-left py-2 pr-4 font-semibold">Chiusura</th>
                    <th className="text-left py-2 font-semibold">Esempi</th>
                  </tr>
                </thead>
                <tbody className="text-hf-text-muted">
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-green-400 font-medium">success</td>
                    <td className="py-2 pr-4">Verde</td>
                    <td className="py-2 pr-4">4 secondi</td>
                    <td className="py-2">Scansione completata, metadati aggiornati</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-yellow-400 font-medium">warning</td>
                    <td className="py-2 pr-4">Giallo</td>
                    <td className="py-2 pr-4">4 secondi</td>
                    <td className="py-2">Metadati mancanti, dischi scollegati</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-red-400 font-medium">error</td>
                    <td className="py-2 pr-4">Rosso</td>
                    <td className="py-2 pr-4">Persistente</td>
                    <td className="py-2">Errori di rete, errori HTTP</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-blue-400 font-medium">special</td>
                    <td className="py-2 pr-4">Blu</td>
                    <td className="py-2 pr-4">Persistente</td>
                    <td className="py-2">Connessione / assenza internet</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">detail</td>
                    <td className="py-2 pr-4">Bianco</td>
                    <td className="py-2 pr-4">Persistente</td>
                    <td className="py-2">Lista film scansionati (lista verticale)</td>
                  </tr>
                  <tr className="border-t border-hf-border">
                    <td className="py-2 pr-4 text-white font-medium">info</td>
                    <td className="py-2 pr-4">Bianco</td>
                    <td className="py-2 pr-4">Persistente</td>
                    <td className="py-2">Fallback informativo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Comportamento</h3>
            <BulletList
              items={[
                'Le notifiche "success" e "warning" si chiudono automaticamente dopo 4 secondi.',
                'Le notifiche "error", "special", "detail" e "info" restano finché non le chiudi manualmente.',
                'Le notifiche di tipo "detail" mostrano una lista verticale con i titoli, non solo il messaggio.',
                'Notifiche duplicate (stesso tipo + stesso messaggio) vengono ignorate per evitare spam.',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Notifiche di rete</h3>
            <p className="text-sm">
              Quando la connessione a internet cade o torna, compare una notifica blu di tipo{' '}
              <em>special</em>. Questo avviso non blocca l'uso dell'app (HomeFlix funziona
              offline), ma ti informa che le chiamate a TMDB potrebbero non riuscire.
            </p>
          </div>

          <Callout variant="info">
            Se il backend è spento o irraggiungibile, l'interceptor delle chiamate API genera
            automaticamente notifiche di errore (rosse) per ogni richiesta fallita. Le notifiche
            duplicate vengono deduplicate in una finestra di 3 secondi.
          </Callout>
        </div>
      ),
    },

    /* ---------------- 13. IMPOSTAZIONI AVANZATE ---------------- */
    {
      id: 'settings',
      title: '13. Impostazioni avanzate',
      shortTitle: 'Impostazioni',
      icon: '⚙️',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            La pagina <strong className="text-white">Impostazioni</strong> raccoglie le
            configurazioni principali di HomeFlix: chiave API TMDB e percorsi dei dischi.
          </p>

          <div>
            <h3 className="text-white font-semibold mb-2">Chiave API TMDB</h3>
            <p className="text-sm">
              Nella sezione dedicata puoi inserire la tua chiave API di TMDB per abilitare il
              recupero automatico dei metadati (trama, poster, cast, trailer). Sono disponibili:
            </p>
            <BulletList
              items={[
                'Campo di input per la chiave, con pulsante mostra/nascondi.',
                'Pulsante "Salva" per memorizzarla.',
                'Pulsante "Elimina" per rimuoverla.',
                'Anteprima della chiave attualmente salvata (offuscata di default).',
              ]}
            />
            <p className="text-sm mt-2 text-hf-text-subtle">
              <em>
                Nota: la gestione della chiave dalla UI è in fase di completamento lato backend.
                Fino al rilascio definitivo, la chiave può essere configurata manualmente nel file
                .env del backend.
              </em>
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Percorsi dei dischi</h3>
            <p className="text-sm">
              Puoi configurare fino a <strong className="text-white">10 percorsi</strong>,
              disposti in due colonne da 5 slot ciascuna. Ogni slot può essere:
            </p>
            <BulletList
              items={[
                <>
                  <strong className="text-white">Vuoto</strong> — mostra un campo di input e un
                  pulsante "+" per aggiungere un percorso.
                </>,
                <>
                  <strong className="text-white">Popolato</strong> — mostra un'icona disco, il
                  nome, il tipo (SSD/HDD/NAS/Cartella), la barra di utilizzo (rossa se sopra il
                  90%), lo spazio usato/libero/totale e un pulsante "✕" per rimuovere.
                </>,
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Aggiornamento dello spazio dischi</h3>
            <p className="text-sm">Lo spazio dei dischi viene aggiornato automaticamente:</p>
            <BulletList
              items={[
                'Al mount della pagina (dopo il caricamento delle impostazioni).',
                'Al ritorno sul tab del browser (refetchOnWindowFocus).',
                'Dopo ogni salvataggio di un nuovo percorso.',
              ]}
            />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Sincronizzazione a runtime</h3>
            <p className="text-sm">
              Quando salvi una modifica ai percorsi, il backend sincronizza immediatamente i
              servizi interni (CoreService e StorageManagerService). Se rimuovi un percorso,
              riceverai una notifica "<em>Disco rimosso</em>" per confermare l'operazione.
            </p>
          </div>

          <Callout variant="warning">
            Rimuovere un percorso dalle impostazioni <strong>non</strong> elimina i contenuti dal
            database: alla prossima scansione i media di quel disco risulteranno semplicemente
            "non disponibili" (<code>available: false</code>).
          </Callout>

          <Callout variant="tip">
            Se colleghi un nuovo disco esterno, aggiungilo come nuovo percorso e avvia una
            scansione: i contenuti verranno indicizzati automaticamente.
          </Callout>
        </div>
      ),
    },
  ];

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <>
      <Header />
      <main className="pt-24 pb-12 hf-container min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-display font-monday">Guida all'uso</h1>
            <p className="text-hf-text-muted mt-2 text-sm">
              Tutto quello che serve per configurare, organizzare e sfruttare al meglio la tua
              libreria HomeFlix.
            </p>
          </div>

          <div className="mt-8 flex gap-8">
            {/* Sidebar indice (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <nav className="sticky top-24 bg-hf-surface border border-hf-border rounded-lg p-2 space-y-0.5">
                <p className="text-[11px] uppercase tracking-wider text-hf-text-subtle font-semibold px-3 py-2">
                  Indice
                </p>
                {sections.map((s) => {
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSidebarClick(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                        isActive
                          ? 'bg-yellow-500/15 text-yellow-300'
                          : 'text-hf-text-muted hover:text-white hover:bg-hf-surface-2 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{s.icon}</span>
                      <span className="truncate">{s.shortTitle}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Contenuto accordion */}
            <div className="flex-1 min-w-0 space-y-3">
              {sections.map((section) => {
                const isOpen = openSections[section.id];
                return (
                  <div
                    key={section.id}
                    id={`section-${section.id}`}
                    className="bg-hf-surface border border-hf-border rounded-lg overflow-hidden scroll-mt-24"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-hf-surface-2 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0">{section.icon}</span>
                        <h2 className="text-lg sm:text-xl font-display font-semibold text-white truncate">
                          {section.title}
                        </h2>
                      </div>
                      <span className="text-hf-text-muted transition-transform duration-200 flex-shrink-0">
                        {isOpen ? '▾' : '▸'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-hf-text-muted">{section.content}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-hf-border pt-6 mt-10 text-sm text-hf-text-subtle max-w-4xl">
            Per dubbi o problemi, consulta i log del backend (console NestJS) o esplora il database
            con <code>npx prisma studio</code>.
          </div>
        </div>
      </main>
    </>
  );
}