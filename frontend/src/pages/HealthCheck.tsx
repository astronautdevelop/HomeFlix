// src/pages/HealthCheck.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Header } from '../components/common/Header';

interface MissingMetadataItem {
  mediaId: string;
  title: string;
  type: string;
  missing: string[];
}

interface MissingImageItem {
  mediaId: string;
  title: string;
  type: string;
  currentPath: string | null;
}

interface DuplicateGroup {
  hash: string;
  count: number;
  items: { mediaId: string; title: string; filePath: string; quality: string }[];
}

interface BrokenFileItem {
  mediaId: string;
  title: string;
  filePath: string;
  quality: string;
}

interface UnavailableItem {
  mediaId: string;
  title: string;
  type: string;
  folderPath: string | null;
}

interface HealthReport {
  totalMedia: number;
  missingMetadata: number;
  missingMetadataItems: MissingMetadataItem[];
  missingPoster: number;
  missingPosterItems: MissingImageItem[];
  missingBackground: number;
  missingBackgroundItems: MissingImageItem[];
  duplicates: DuplicateGroup[];
  brokenFiles: BrokenFileItem[];
  unavailableMedia: number;
  unavailableMediaItems: UnavailableItem[];
  scanTimestamp: string;
}

const fetchHealthReport = async (): Promise<HealthReport> => {
  const response = await api.get('/health-check');
  return response.data;
};

type OpenSection =
  | 'metadata'
  | 'poster'
  | 'background'
  | 'unavailable'
  | 'duplicates'
  | 'broken'
  | null;

export function HealthCheck() {
  const [openSection, setOpenSection] = useState<OpenSection>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['health-check'],
    queryFn: fetchHealthReport,
    staleTime: 60000,
  });

  const toggle = (section: OpenSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento report...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-red-500 text-xl">Errore: {(error as Error).message}</div>
        </div>
      </>
    );
  }

  if (!data) return null;

  const {
    totalMedia,
    missingMetadata,
    missingMetadataItems,
    missingPoster,
    missingPosterItems,
    missingBackground,
    missingBackgroundItems,
    duplicates,
    brokenFiles,
    unavailableMedia,
    unavailableMediaItems,
    scanTimestamp,
  } = data;

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1>
              <span className="text-3xl font-monday text-white">Health Check - </span>
              <span className="text-3xl font-bold text-white">Integrità Libreria</span>
            </h1>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Ultima scansione: {new Date(scanTimestamp).toLocaleString()}
          </p>
          <hr className="border-gray-800 mb-6" />

          {/* Riepilogo card */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <div className="bg-purple-800 p-4 border rounded-lg">
              <h3 className="text-gray-300 text-sm uppercase">Totale Film</h3>
              <p className="text-2xl font-bold text-white">{totalMedia}</p>
            </div>

            <button
              onClick={() => toggle('metadata')}
              className={`bg-dark-800 p-4 rounded-lg text-left transition-all hover:bg-gray-800 ${
                openSection === 'metadata'
                  ? 'ring-2 ring-yellow-400'
                  : 'hover:bg-dark-700'
              }`}
            >
              <h3 className="text-gray-400 text-sm uppercase">Metadati Mancanti</h3>
              <p className="text-2xl font-bold text-yellow-400">{missingMetadata}</p>
            </button>

            <button
              onClick={() => toggle('poster')}
              className={`bg-dark-800 p-4 rounded-lg text-left transition-all hover:bg-gray-800 ${
                openSection === 'poster' ? 'ring-2 ring-yellow-400' : 'hover:bg-dark-700'
              }`}
            >
              <h3 className="text-gray-400 text-sm uppercase">Poster Mancanti</h3>
              <p className="text-2xl font-bold text-yellow-400">{missingPoster}</p>
            </button>

            <button
              onClick={() => toggle('background')}
              className={`bg-dark-800 p-4 rounded-lg text-left transition-all hover:bg-gray-800 ${
                openSection === 'background'
                  ? 'ring-2 ring-yellow-400'
                  : 'hover:bg-dark-700'
              }`}
            >
              <h3 className="text-gray-400 text-sm uppercase">Background Mancanti</h3>
              <p className="text-2xl font-bold text-yellow-400">{missingBackground}</p>
            </button>

            <button
              onClick={() => toggle('unavailable')}
              className={`bg-dark-800 p-4 rounded-lg text-left transition-all hover:bg-gray-800 ${
                openSection === 'unavailable'
                  ? 'ring-2 ring-red-400'
                  : 'hover:bg-dark-700'
              }`}
            >
              <h3 className="text-gray-400 text-sm uppercase">Non Disponibili</h3>
              <p className="text-2xl font-bold text-red-400">{unavailableMedia}</p>
            </button>
          </div>

          {/* ====== Metadati mancanti ====== */}
          {openSection === 'metadata' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Dettaglio Metadati Mancanti
              </h2>
              {missingMetadataItems.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Nessun metadato mancante.</p>
                </div>
              ) : (
                <div
                  className={`space-y-2 ${
                    missingMetadataItems.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {missingMetadataItems.map((m) => (
                    <div key={m.mediaId} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-white font-medium">{m.title}</span>
                          <span className="ml-3 text-xs uppercase text-gray-500">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {m.mediaId}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.missing.map((field) => (
                          <span
                            key={field}
                            className="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== Poster mancanti ====== */}
          {openSection === 'poster' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">Dettaglio Poster Mancanti</h2>
              {missingPosterItems.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Tutti i poster sono presenti.</p>
                </div>
              ) : (
                <div
                  className={`space-y-2 ${
                    missingPosterItems.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {missingPosterItems.map((m) => (
                    <div key={m.mediaId} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-white font-medium">{m.title}</span>
                          <span className="ml-3 text-xs uppercase text-gray-500">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {m.mediaId}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 break-all">
                        Path DB: {m.currentPath ?? '(vuoto)'} — file non trovato
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== Background mancanti ====== */}
          {openSection === 'background' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Dettaglio Background Mancanti
              </h2>
              {missingBackgroundItems.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Tutti i background sono presenti.</p>
                </div>
              ) : (
                <div
                  className={`space-y-2 ${
                    missingBackgroundItems.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {missingBackgroundItems.map((m) => (
                    <div key={m.mediaId} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-white font-medium">{m.title}</span>
                          <span className="ml-3 text-xs uppercase text-gray-500">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {m.mediaId}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 break-all">
                        Path DB: {m.currentPath ?? '(vuoto)'} — file non trovato
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== Non disponibili ====== */}
          {openSection === 'unavailable' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Dettaglio Film Non Disponibili
              </h2>
              {unavailableMediaItems.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Tutti i media sono disponibili.</p>
                </div>
              ) : (
                <div
                  className={`space-y-2 ${
                    unavailableMediaItems.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {unavailableMediaItems.map((m) => (
                    <div key={m.mediaId} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-white font-medium">{m.title}</span>
                          <span className="ml-3 text-xs uppercase text-gray-500">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {m.mediaId}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 break-all">
                        Cartella: {m.folderPath ?? '(sconosciuta)'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== Duplicati ====== */}
          <div className="mb-8">
            <button
              onClick={() => toggle('duplicates')}
              className="w-full text-left mb-3 flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold text-white">
                Duplicati ({duplicates.length})
              </h2>
              <span className="text-gray-400 text-sm">
                {openSection === 'duplicates' ? '▲ Chiudi' : '▼ Espandi'}
              </span>
            </button>
            {openSection === 'duplicates' && (
              duplicates.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Nessun duplicato trovato.</p>
                </div>
              ) : (
                <div
                  className={`space-y-3 ${
                    duplicates.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {duplicates.map((dup) => (
                    <div key={dup.hash} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-gray-400 break-all">
                          hash: {dup.hash}
                        </span>
                        <span className="text-red-400 font-bold">×{dup.count}</span>
                      </div>
                      <div className="space-y-1 ml-2">
                        {dup.items.map((it, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-white">{it.title}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              [{it.quality}]
                            </span>
                            <p className="text-xs text-gray-500 break-all">
                              {it.filePath}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* ====== File rotti ====== */}
          <div>
            <button
              onClick={() => toggle('broken')}
              className="w-full text-left mb-3 flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold text-white">
                File Rotti ({brokenFiles.length})
              </h2>
              <span className="text-gray-400 text-sm">
                {openSection === 'broken' ? '▲ Chiudi' : '▼ Espandi'}
              </span>
            </button>
            {openSection === 'broken' && (
              brokenFiles.length === 0 ? (
                <div className="bg-dark-800 p-4 rounded-lg">
                  <p className="text-green-400">✅ Tutti i file sono accessibili.</p>
                </div>
              ) : (
                <div
                  className={`space-y-2 ${
                    brokenFiles.length > 5
                      ? 'max-h-[400px] overflow-y-auto pr-2'
                      : ''
                  }`}
                >
                  {brokenFiles.map((bf, idx) => (
                    <div key={`${bf.mediaId}-${idx}`} className="bg-dark-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-white font-medium">{bf.title}</span>
                        <span className="text-xs text-gray-500">[{bf.quality}]</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 break-all">{bf.filePath}</p>
                      <p className="text-xs text-gray-600 font-mono">ID: {bf.mediaId}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HealthCheck;