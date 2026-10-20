import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/common/Header';

interface MediaItem {
  id: string;
  title: string;
  releaseYear: number | null;
  createdAt: string;
  type: string;
  genres: string[] | null;
  available: boolean;
  seriesId?: string | null;
  episodeNumber?: number | null;
}

export function Datacenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'genre' | 'added' | 'available'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const queryClient = useQueryClient();

  // 🔥 includeEpisodes=true → mostra anche gli episodi
  const { data: media, isLoading, error } = useQuery({
    queryKey: ['media', 'datacenter'],
    queryFn: () => api.get('/media?includeEpisodes=true').then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', 'datacenter'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    },
    onError: (err: any) => {
      console.error('Errore eliminazione:', err);
      alert('Errore durante l\'eliminazione del film.');
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async (mediaIds: string[]) => {
      await Promise.all(mediaIds.map(id => api.delete(`/media/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', 'datacenter'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    },
    onError: (err: any) => {
      console.error('Errore eliminazione multipla:', err);
      alert('Si è verificato un errore durante l\'eliminazione di alcuni film.');
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare definitivamente "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteAll = () => {
    if (!media || media.length === 0) return;
    if (window.confirm(`Sei sicuro di voler eliminare TUTTI i ${media.length} contenuti? Questa operazione è irreversibile.`)) {
      const ids = media.map((m: MediaItem) => m.id);
      deleteAllMutation.mutate(ids);
    }
  };

  let filteredMedia = (media || []).filter((m: MediaItem) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    let compareA: string | number | boolean;
    let compareB: string | number | boolean;

    switch (sortBy) {
      case 'title':
        compareA = a.title.toLowerCase();
        compareB = b.title.toLowerCase();
        break;
      case 'year':
        compareA = a.releaseYear ?? 0;
        compareB = b.releaseYear ?? 0;
        break;
      case 'genre': {
        const genreA = a.genres && a.genres.length > 0 ? a.genres[0] : '';
        const genreB = b.genres && b.genres.length > 0 ? b.genres[0] : '';
        compareA = genreA.toLowerCase();
        compareB = genreB.toLowerCase();
        break;
      }
      case 'added':
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
        break;
      case 'available':
        compareA = a.available !== false;
        compareB = b.available !== false;
        break;
      default:
        compareA = a.title.toLowerCase();
        compareB = b.title.toLowerCase();
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const availableCount = sortedMedia.filter((m: MediaItem) => m.available !== false).length;
  const unavailableCount = sortedMedia.filter((m: MediaItem) => m.available === false).length;

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
            <h1 className="text-3xl text-white font-monday">📂 Datacenter</h1>
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-sm">
                ✅ {availableCount} disponibili
              </span>
              {unavailableCount > 0 && (
                <span className="text-red-400 text-sm">
                  ❌ {unavailableCount} non disponibili
                </span>
              )}
              <span className="text-gray-400 text-sm">
                Totale: {sortedMedia.length}
              </span>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Cerca per nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[180px] bg-dark-800 
              text-white border border-gray-600 
              rounded-lg px-4 py-2 focus:outline-none 
              focus:border-gold transition-colors"
            />

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 bg-gray-300
                text-black rounded rounded-lg border 
                border-gray-600 hover:bg-dark-700 
                hover:text-gray-800 focus:outline-none 
                focus:border-gold transition-colors"
              >
                <option value="title">Titolo</option>
                <option value="year">Anno</option>
                <option value="genre">Genere</option>
                <option value="added">Data aggiunta</option>
                <option value="available">Disponibilità</option>
              </select>

              <button
                onClick={toggleSortOrder}
                className="bg-dark-800 text-white border 
                border-gray-600 rounded-lg px-3 py-2 hover:bg-dark-700 transition-colors"
                title={sortOrder === 'asc' ? 'Ordine crescente' : 'Ordine decrescente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <button
              onClick={handleDeleteAll}
              disabled={deleteAllMutation.isPending || !media || media.length === 0}
              className="px-4 py-2 bg-red-700 text-gray-100 
              text-sm rounded-lg hover:bg-red-900 
              hover:text-white transition-colors 
              border border-gray-700 hover:scale-105 
              block transition-colors disabled:opacity-50 
              disabled:cursor-not-allowed"
            >
              {deleteAllMutation.isPending ? 'Eliminazione...' : 'Elimina tutti'}
            </button>
          </div>

          {isLoading && (
            <div className="text-gray-400 text-center py-8">Caricamento...</div>
          )}

          {error && (
            <div className="text-red-500 text-center py-8">
              Errore nel caricamento.
            </div>
          )}

          {!isLoading && !error && sortedMedia.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              {searchTerm ? 'Nessun risultato.' : 'Nessun contenuto nella libreria.'}
            </div>
          )}

          {!isLoading && !error && sortedMedia.length > 0 && (
            <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
              {sortedMedia.map((m: MediaItem) => {
                const isAvailable = m.available !== false;
                const isEpisode = m.type === 'EPISODE';
                return (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between py-3 border-b border-gray-700/50 px-2 rounded transition-colors ${
                      !isAvailable ? 'bg-red-950/20 hover:bg-red-950/40' : 'hover:bg-dark-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                      <Link
                        to={`/movie/${m.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex-shrink-0"
                      >
                        Apri
                      </Link>
                      {/* 🔥 Badge tipo */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          isEpisode
                            ? 'bg-purple-600 text-white'
                            : 'bg-blue-800 text-white'
                        }`}
                      >
                        {isEpisode
                          ? `EP${m.episodeNumber ? ` ${m.episodeNumber}` : ''}`
                          : 'FILM'}
                      </span>
                      <span className={`font-medium truncate ${!isAvailable ? 'text-gray-400' : 'text-white'}`}>
                        {m.title}
                        {!isAvailable && (
                          <span className="ml-2 text-xs text-red-400">(non disponibile)</span>
                        )}
                      </span>
                      <span className="text-gray-400 text-sm ml-4 flex-shrink-0">
                        {m.releaseYear || 'N/A'}
                      </span>
                      {m.genres && m.genres.length > 0 && (
                        <span className="text-gray-500 text-xs ml-4 flex-shrink-0">
                          {m.genres[0]}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs ml-4 flex-shrink-0">
                        Aggiunto: {new Date(m.createdAt).toLocaleDateString('it-IT')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isAvailable ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {isAvailable ? '✅ Disponibile' : '❌ Non disponibile'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      disabled={deleteMutation.isPending}
                      className="ml-4 text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-500/50 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {deleteMutation.isPending && deleteMutation.variables === m.id
                        ? '...'
                        : 'Elimina'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}