// src/pages/Settings.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSettings,
  updateSettings,
  getDiskSpace,
  validateTmdbKey,
} from '@/services/api';

interface StorageDevice {
  path: string;
  name: string;
  totalSpace: number;
  usedSpace: number;
  freeSpace: number;
  type: 'SSD' | 'HDD' | 'NAS' | 'Cartella';
  isAvailable: boolean;
}

const DiscIcon = () => (
  <img src="/icons/icon_disk_black.svg" className="w-10 h-10" />
);

export function Settings() {
  const queryClient = useQueryClient();

  // Stato locale per la chiave (UI)
  const [tmdbKey, setTmdbKey] = useState('');
  const [showInputKey, setShowInputKey] = useState(false);
  const [showDisplayKey, setShowDisplayKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Stato validazione in corso
  const [isValidating, setIsValidating] = useState(false);

  // Carica le impostazioni dal backend
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Carica lo spazio dischi
  const { data: devicesData, refetch: refetchDevices } = useQuery({
    queryKey: ['disk-space'],
    queryFn: getDiskSpace,
    enabled: !!settings && !settingsLoading,
    refetchOnWindowFocus: true,
  });

  // Mutazione per salvare le impostazioni
  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaveMessage('✅ Impostazioni salvate con successo');
      setTimeout(() => setSaveMessage(''), 3000);
      refetchDevices();
    },
    onError: (err: any) => {
      setSaveMessage(`❌ Errore: ${err?.response?.data?.message || err.message}`);
      setTimeout(() => setSaveMessage(''), 4000);
    },
  });

  // Inizializza lo stato con i dati caricati
  useEffect(() => {
    if (settings) {
      setTmdbKey(settings.tmdbApiKey || '');
    }
  }, [settings]);

  // Gestione salvataggio chiave (con validazione preventiva)
  const handleSaveKey = async () => {
    const trimmed = tmdbKey.trim();
    if (!trimmed) {
      setSaveMessage('Inserisci una chiave valida');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsValidating(true);
    setSaveMessage('🔄 Verifica chiave in corso...');

    try {
      const result = await validateTmdbKey(trimmed);

      if (!result.valid) {
        setSaveMessage(`❌ ${result.message}`);
        setTimeout(() => setSaveMessage(''), 5000);
        return;
      }

      // Chiave valida → salva
      setSaveMessage('💾 Chiave valida, salvataggio...');
      updateMutation.mutate({ tmdbApiKey: trimmed });
    } catch (err: any) {
      setSaveMessage(
        `❌ Errore di validazione: ${
          err?.response?.data?.message || err.message
        }`,
      );
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeleteKey = () => {
    if (!settings?.tmdbApiKey) return;
    if (!confirm('Eliminare la chiave API TMDB?')) return;
    setTmdbKey('');
    updateMutation.mutate({ tmdbApiKey: '' });
  };

  // Gestione percorsi
  const [slots, setSlots] = useState<(string | null)[]>(Array(10).fill(null));
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  useEffect(() => {
    if (settings?.mediaRoots) {
      const roots = settings.mediaRoots;
      const newSlots = Array(10).fill(null) as (string | null)[];
      roots.forEach((p: string, i: number) => {
        if (i < 10) newSlots[i] = p;
      });
      setSlots(newSlots);
    }
  }, [settings]);

  const addPath = (index: number) => {
    const raw = inputValues[index]?.trim();
    if (!raw) return;
    const newPath = raw.replace(/\\/g, '/');

    const existing = slots.filter((p) => p !== null);
    if (existing.includes(newPath)) {
      alert('Questo percorso è già stato aggiunto');
      return;
    }

    const newSlots = [...slots];
    newSlots[index] = newPath;
    setSlots(newSlots);
    setInputValues((prev) => ({ ...prev, [index]: '' }));

    const validPaths = newSlots.filter((p): p is string => p !== null);
    updateMutation.mutate({ mediaRoots: validPaths });
  };

  const removePath = (index: number) => {
    if (!slots[index]) return;
    if (!confirm(`Rimuovere il percorso "${slots[index]}"?`)) return;
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    const validPaths = newSlots.filter((p): p is string => p !== null);
    updateMutation.mutate({ mediaRoots: validPaths });
  };

  const getDriveInfo = useCallback(
    (path: string | null): StorageDevice | null => {
      if (!path || !devicesData) return null;
      const found = devicesData.find((d: any) => d.path === path);
      if (!found) return null;
      return {
        path: found.path,
        name: found.name || path.split(/[\\/]/).pop() || path,
        totalSpace: found.totalSpace || 0,
        usedSpace: (found.totalSpace || 0) - (found.freeSpace || 0),
        freeSpace: found.freeSpace || 0,
        type: found.type || 'Cartella',
        isAvailable: found.isAvailable ?? true,
      };
    },
    [devicesData],
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB';
    const gb = bytes / 1024 ** 3;
    if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
    return `${Math.round(gb)} GB`;
  };

  const getPercent = (used: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  };

  const occupiedCount = slots.filter(Boolean).length;
  const isBusy = updateMutation.isPending || isValidating;

  return (
    <>
      <Header />
      <main className="pt-24 pb-12 hf-container min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-display font-monday">⚙️ Impostazioni</h1>

          {saveMessage && (
            <div
              className={`p-3 rounded-md text-sm font-medium ${
                saveMessage.startsWith('✅')
                  ? 'bg-green-900/50 text-green-300 border border-green-700'
                  : saveMessage.startsWith('🔄') ||
                    saveMessage.startsWith('💾')
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                  : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}
            >
              {saveMessage}
            </div>
          )}

          {/* SEZIONE TMDB */}
          <section className="bg-hf-surface p-6 rounded-lg border border-hf-border">
            <h2 className="text-xl font-display font-semibold text-white mb-4">
              Chiave API TMDB
            </h2>
            <p className="text-hf-text-muted text-sm mb-3">
              Inserisci la tua chiave API di TMDB per abilitare il recupero dei
              metadati. La chiave viene validata prima del salvataggio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type={showInputKey ? 'text' : 'password'}
                  value={tmdbKey}
                  onChange={(e) => setTmdbKey(e.target.value)}
                  placeholder="Inserisci la chiave API TMDB"
                  disabled={settingsLoading || isBusy}
                  className="w-full bg-hf-surface-2 border border-hf-border rounded-md px-4 py-2 pr-12 text-white placeholder:text-hf-text-subtle focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowInputKey((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hf-text-subtle hover:text-white transition-colors text-lg"
                  title={showInputKey ? 'Nascondi chiave' : 'Mostra chiave'}
                >
                  {showInputKey ? '🙈' : '👁️'}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                disabled={isBusy || settingsLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium px-6 py-2 rounded-md transition-colors"
              >
                {isValidating
                  ? 'Verifica...'
                  : updateMutation.isPending
                  ? 'Salvataggio...'
                  : 'Salva'}
              </button>
              {settings?.tmdbApiKey && (
                <button
                  onClick={handleDeleteKey}
                  disabled={isBusy}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Elimina
                </button>
              )}
            </div>

            <div className="mt-4">
              <p className="text-hf-text-subtle text-sm mb-1">
                Chiave salvata:
              </p>
              <div className="bg-hf-surface-2 border border-hf-border rounded-md px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-sm text-white break-all">
                  {settings?.tmdbApiKey
                    ? showDisplayKey
                      ? settings.tmdbApiKey
                      : '••••••••••••'
                    : '—'}
                </span>
                {settings?.tmdbApiKey && (
                  <button
                    onClick={() => setShowDisplayKey((s) => !s)}
                    className="text-hf-text-subtle hover:text-white transition-colors ml-2 text-lg"
                  >
                    {showDisplayKey ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* SEZIONE PERCORSI DISCHI */}
          <section className="bg-hf-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-white">
                Percorsi dei dischi
              </h2>
              <span className="text-hf-text-subtle text-sm">
                {occupiedCount} / 10 percorsi
              </span>
            </div>
            <p className="text-hf-text-muted text-sm mb-4">
              Inserisci i percorsi assoluti delle tue cartelle media (es.{' '}
              <code className="text-yellow-500">E:/Film</code>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_, index) => {
                const path = slots[index];
                const isOccupied = path !== null;
                const drive = isOccupied ? getDriveInfo(path) : null;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 bg-gray-800 transition-all ${
                      isOccupied
                        ? 'bg-hf-surface-2/70 border-purple-600'
                        : 'bg-hf-surface-2/30 border-dashed border-hf-border/50'
                    }`}
                  >
                    {isOccupied ? (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <DiscIcon />
                            <div className="min-w-0 flex-1">
                              <h3
                                className="text-white font-semibold truncate"
                                title={drive?.name || path}
                              >
                                {drive?.name ||
                                  path.split(/[\\/]/).pop() ||
                                  path}
                              </h3>
                              <p
                                className="text-hf-text-subtle text-xs font-mono break-all"
                                title={path}
                              >
                                {path}
                              </p>
                              {drive && !drive.isAvailable && (
                                <span className="text-xs text-red-400 font-medium">
                                  Non disponibile
                                </span>
                              )}
                              {!drive && (
                                <span className="text-xs text-yellow-400 font-medium">
                                  Spazio non rilevato
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {drive && (
                              <span className="text-xs bg-hf-surface-3 px-2 py-0.5 rounded text-hf-text-muted whitespace-nowrap">
                                {drive.type}
                              </span>
                            )}
                            <button
                              onClick={() => removePath(index)}
                              disabled={isBusy}
                              className="text-white hover:bg-red-900 hover:scale-105 border bg-red-600 px-2 py-0.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                              title="Rimuovi percorso"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {drive && drive.totalSpace > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-hf-text-muted">
                              <span>Usato {formatBytes(drive.usedSpace)}</span>
                              <span>Libero {formatBytes(drive.freeSpace)}</span>
                              <span>Totale {formatBytes(drive.totalSpace)}</span>
                            </div>
                            <div className="w-full bg-hf-surface-3 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  getPercent(
                                    drive.usedSpace,
                                    drive.totalSpace,
                                  ) > 90
                                    ? 'bg-red-500 border border-red-200'
                                    : 'bg-yellow-500 border border-yellow-200'
                                }`}
                                style={{
                                  width: `${getPercent(
                                    drive.usedSpace,
                                    drive.totalSpace,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inputValues[index] || ''}
                          onChange={(e) =>
                            setInputValues((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addPath(index);
                          }}
                          placeholder="Es. E:/Film"
                          disabled={isBusy}
                          className="flex-1 bg-hf-surface-2 border border-hf-border rounded-md px-3 py-2 text-white text-sm placeholder:text-hf-text-subtle focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                        />
                        <button
                          onClick={() => addPath(index)}
                          disabled={isBusy || !inputValues[index]?.trim()}
                          className="w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-full text-white font-bold text-lg transition-colors flex-shrink-0"
                          title="Aggiungi percorso"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}