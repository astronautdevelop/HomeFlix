// src/components/media/EpisodeMetadataEditorForm.tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notificationStore';
import {
  updateEpisodeMetadata,
  uploadEpisodeBackground,
  type UpdateEpisodeMetadataDto,
} from '@/services/api';

interface EpisodeLike {
  id: string;
  title: string;
  originalTitle?: string | null;
  plot?: string | null;
  rating?: number | null;
  runtime?: number | null;
  country?: string | null;
}

interface Props {
  episode: EpisodeLike;
  onClose: () => void;
  onSaved: () => void;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function EpisodeMetadataEditorForm({ episode, onClose, onSaved }: Props) {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [title, setTitle] = useState(episode.title || '');
  const [originalTitle, setOriginalTitle] = useState(episode.originalTitle || '');
  const [plot, setPlot] = useState(episode.plot || '');
  const [runtime, setRuntime] = useState<string>(
    episode.runtime != null ? String(episode.runtime) : '',
  );
  const [rating, setRating] = useState<string>(
    episode.rating != null ? String(episode.rating) : '',
  );
  const [country, setCountry] = useState(episode.country || '');

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        id: newId(),
        type: 'warning',
        message: "L'immagine non deve superare i 10MB",
        createdAt: new Date(),
        read: false,
      });
      return;
    }
    setBackgroundFile(file);
    setBackgroundPreview(URL.createObjectURL(file));
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addNotification({
        id: newId(),
        type: 'warning',
        message: 'Il titolo è obbligatorio',
        createdAt: new Date(),
        read: false,
      });
      return;
    }

    setSaving(true);
    try {
      const dto: UpdateEpisodeMetadataDto = {
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        plot: plot.trim() || undefined,
        rating: rating !== '' ? Number(rating) : undefined,
        runtime: runtime !== '' ? Number(runtime) : undefined,
        country: country.trim() || undefined,
      };

      await updateEpisodeMetadata(episode.id, dto);

      if (backgroundFile) {
        await uploadEpisodeBackground(episode.id, backgroundFile);
      }

      queryClient.invalidateQueries({ queryKey: ['media', episode.id] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['season'] });
      queryClient.invalidateQueries({ queryKey: ['continue-watching'] });

      addNotification({
        id: newId(),
        type: 'success',
        message: `Metadati episodio "${title}" aggiornati`,
        createdAt: new Date(),
        read: false,
      });

      onSaved();
    } catch (err) {
      console.error('Errore salvataggio metadati episodio:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-dark-900 border border-dark-600 rounded-md px-3 py-2 text-white text-sm placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-netflix-yellow disabled:opacity-50';
  const labelClass =
    'block text-xs font-semibold text-dark-300 uppercase tracking-wide mb-1';
  const sectionTitleClass =
    'text-sm font-semibold text-netflix-yellow uppercase tracking-wider mb-3 mt-6 pb-1 border-b border-dark-700';

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-dark-800/70 border border-dark-700 rounded-lg p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          📝 Modifica Metadati Episodio
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="text-dark-300 hover:text-white transition-colors text-xl leading-none"
          title="Chiudi"
        >
          ✕
        </button>
      </div>

      <div className={sectionTitleClass}>Informazioni principali</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Titolo *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Titolo dell'episodio"
            disabled={saving}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Titolo originale</label>
          <input
            type="text"
            value={originalTitle}
            onChange={(e) => setOriginalTitle(e.target.value)}
            className={inputClass}
            placeholder="Titolo originale"
            disabled={saving}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Trama</label>
          <textarea
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            rows={4}
            className={inputClass}
            placeholder="Descrizione / trama dell'episodio..."
            disabled={saving}
          />
        </div>

        <div>
          <label className={labelClass}>Durata (minuti)</label>
          <input
            type="number"
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            min={0}
            className={inputClass}
            placeholder="es. 45"
            disabled={saving}
          />
        </div>

        <div>
          <label className={labelClass}>Rating (0–10)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min={0}
            max={10}
            step={0.1}
            className={inputClass}
            placeholder="es. 7.5"
            disabled={saving}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Paese</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
            placeholder="es. Italia"
            disabled={saving}
          />
        </div>
      </div>

      <div className={sectionTitleClass}>Immagine di sfondo</div>
      <p className="text-dark-400 text-xs mb-3">
        ℹ️ Il poster dell'episodio eredita automaticamente quello della serie. Qui puoi
        modificare solo il background (still).
      </p>
      <div className="max-w-md">
        <div className="bg-dark-900 border border-dark-600 rounded-md p-3">
          <div className="w-full aspect-video bg-dark-800 rounded flex items-center justify-center overflow-hidden mb-3">
            {backgroundPreview ? (
              <img
                src={backgroundPreview}
                alt="Anteprima background"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`/api/media/image/${episode.id}?type=background&v=${Date.now()}`}
                alt="Background attuale"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <label
            className={`block text-center text-xs font-medium py-2 rounded cursor-pointer transition-colors ${
              saving
                ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                : 'bg-gray-600 text-black hover:bg-gray-400 border hover:border-white'
            }`}
          >
            {backgroundPreview ? '🔄 Cambia background' : '📁 Scegli background'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
              onChange={handleBackgroundChange}
              disabled={saving}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dark-700">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-dark-600 border border-gray-800 hover:border-gray-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 hover:scale-110 border border-gray-400 hover:border-gray-300 disabled:bg-dark-600 text-white rounded-md text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? '⏳ Salvataggio...' : '💾 Salva Metadati'}
        </button>
      </div>
    </form>
  );
}