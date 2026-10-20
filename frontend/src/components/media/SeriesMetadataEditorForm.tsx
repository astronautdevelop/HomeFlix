// src/components/media/SeriesMetadataEditorForm.tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notificationStore';
import { ALL_GENRES, SPECIAL_GENRES } from '@/config/genres';

const SERIES_ALL_GENRES = [...ALL_GENRES, ...SPECIAL_GENRES];
import {
  updateSeriesMetadata,
  uploadSeriesPoster,
  uploadSeriesBackground,
  type UpdateSeriesMetadataDto,
} from '@/services/api';

interface SeriesLike {
  id: string;
  title: string;
  originalTitle?: string | null;
  plot?: string | null;
  genres?: any;
  actors?: any;
  director?: string | null;
  country?: string | null;
  language?: string | null;
  rating?: number | null;
  releaseYear?: number | null;
  runtime?: number | null;
}

interface Props {
  series: SeriesLike;
  onClose: () => void;
  onSaved: () => void;
}

function safeStringArray(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === 'string');
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function SeriesMetadataEditorForm({ series, onClose, onSaved }: Props) {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [title, setTitle] = useState(series.title || '');
  const [originalTitle, setOriginalTitle] = useState(series.originalTitle || '');
  const [plot, setPlot] = useState(series.plot || '');
  const [releaseYear, setReleaseYear] = useState<string>(
    series.releaseYear != null ? String(series.releaseYear) : '',
  );
  const [runtime, setRuntime] = useState<string>(
    series.runtime != null ? String(series.runtime) : '',
  );
  const [rating, setRating] = useState<string>(
    series.rating != null ? String(series.rating) : '',
  );
  const [country, setCountry] = useState(series.country || '');
  const [director, setDirector] = useState(series.director || '');
  const [language, setLanguage] = useState(series.language || '');

  const [genres, setGenres] = useState<string[]>(safeStringArray(series.genres));
  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const [actors, setActors] = useState<string[]>(safeStringArray(series.actors));
  const [actorInput, setActorInput] = useState('');
  const addActor = () => {
    const name = actorInput.trim();
    if (!name) return;
    if (actors.includes(name)) {
      setActorInput('');
      return;
    }
    setActors([...actors, name]);
    setActorInput('');
  };
  const removeActor = (name: string) => setActors(actors.filter((a) => a !== name));

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'poster' | 'background',
  ) => {
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
    const url = URL.createObjectURL(file);
    if (type === 'poster') {
      setPosterFile(file);
      setPosterPreview(url);
    } else {
      setBackgroundFile(file);
      setBackgroundPreview(url);
    }
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
      const dto: UpdateSeriesMetadataDto = {
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        plot: plot.trim() || undefined,
        genres,
        actors,
        country: country.trim() || undefined,
        director: director.trim() || undefined,
        language: language.trim() || undefined,
        rating: rating !== '' ? Number(rating) : undefined,
        releaseYear: releaseYear !== '' ? Number(releaseYear) : undefined,
        runtime: runtime !== '' ? Number(runtime) : undefined,
      };

      await updateSeriesMetadata(series.id, dto);

      if (posterFile) await uploadSeriesPoster(series.id, posterFile);
      if (backgroundFile) await uploadSeriesBackground(series.id, backgroundFile);

      queryClient.invalidateQueries({ queryKey: ['season'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['continue-watching'] });

      addNotification({
        id: newId(),
        type: 'success',
        message: `Metadati serie "${title}" aggiornati`,
        createdAt: new Date(),
        read: false,
      });

      onSaved();
    } catch (err) {
      console.error('Errore salvataggio metadati serie:', err);
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
          📝 Modifica Metadati Serie
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

      {/* ---------- Informazioni principali ---------- */}
      <div className={sectionTitleClass}>Informazioni principali</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Titolo *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Titolo della serie"
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
            placeholder="Descrizione / trama della serie..."
            disabled={saving}
          />
        </div>

        <div>
          <label className={labelClass}>Anno di uscita</label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            min={1888}
            max={2100}
            className={inputClass}
            placeholder="es. 2001"
            disabled={saving}
          />
        </div>

        <div>
          <label className={labelClass}>Durata media episodio (minuti)</label>
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

        <div>
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

        <div>
          <label className={labelClass}>Lingua</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputClass}
            placeholder="es. it"
            disabled={saving}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Regista</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className={inputClass}
            placeholder="Nome del regista"
            disabled={saving}
          />
        </div>
      </div>

      {/* ---------- Generi ---------- */}
      <div className={sectionTitleClass}>Generi</div>
      <div className="flex flex-wrap gap-2">
        {SERIES_ALL_GENRES.map((genre) => {
          const active = genres.includes(genre);
          return (
            <button
              type="button"
              key={genre}
              onClick={() => toggleGenre(genre)}
              disabled={saving}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'bg-purple-800 text-white border-netflix-yellow'
                  : 'bg-dark-900 text-dark-200 border-dark-600 hover:bg-yellow-600 hover:scale-110 hover:border-netflix-yellow'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {active ? '✓ ' : ''}
              {genre}
            </button>
          );
        })}
      </div>

      {/* ---------- Cast ---------- */}
      <div className={sectionTitleClass}>Cast</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {actors.map((actor) => (
          <span
            key={actor}
            className="inline-flex items-center gap-2 bg-dark-900 border border-dark-600 text-white text-xs px-3 py-1 rounded-full"
          >
            {actor}
            <button
              type="button"
              onClick={() => removeActor(actor)}
              disabled={saving}
              className="text-red-400 hover:text-red-200 transition-colors"
              title="Rimuovi"
            >
              ✕
            </button>
          </span>
        ))}
        {actors.length === 0 && (
          <span className="text-dark-400 text-xs italic">Nessun attore aggiunto</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={actorInput}
          onChange={(e) => setActorInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addActor();
            }
          }}
          className={inputClass}
          placeholder="Nome attore, poi premi Enter"
          disabled={saving}
        />
        <button
          type="button"
          onClick={addActor}
          disabled={saving || !actorInput.trim()}
          className="bg-green-600 hover:bg-green-700 hover:scale-110 border border-gray-900 hover:border-gray-300 disabled:bg-dark-600 text-white px-4 rounded-md font-bold transition-colors"
        >
          +
        </button>
      </div>

      {/* ---------- Immagini ---------- */}
      <div className={sectionTitleClass}>Immagini</div>
      <p className="text-dark-400 text-xs mb-3">
        ℹ️ Il poster della serie viene automaticamente ereditato da tutti gli episodi.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* POSTER */}
        <div>
          <label className={labelClass}>Poster</label>
          <div className="bg-dark-900 border border-dark-600 rounded-md p-3">
            <div className="w-full aspect-[2/3] bg-dark-800 rounded flex items-center justify-center overflow-hidden mb-3">
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Anteprima poster"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`/api/media/series/${series.id}/image?type=poster&v=${Date.now()}`}
                  alt="Poster attuale"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label
              className={`block text-center text-xs font-medium py-2 rounded cursor-pointer transition-colors ${
                saving
                  ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                  : 'bg-gray-600 text-black hover:bg-gray-400 border hover:border-white'
              }`}
            >
              {posterPreview ? '🔄 Cambia poster' : '📁 Scegli poster'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                onChange={(e) => handleFileChange(e, 'poster')}
                disabled={saving}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* BACKGROUND */}
        <div>
          <label className={labelClass}>Background</label>
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
                  src={`/api/media/series/${series.id}/image?type=background&v=${Date.now()}`}
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
                onChange={(e) => handleFileChange(e, 'background')}
                disabled={saving}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* ---------- Pulsanti ---------- */}
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