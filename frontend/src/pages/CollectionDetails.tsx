import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, useMemo } from 'react';
import {
  getCollection,
  removeMediaFromCollection,
  addMediaToCollection,
  updateCollection,
  uploadCollectionImage,
  getMedia,
} from '@/services/api';
import { Header } from '@/components/common/Header';
import { ALL_GENRES, GENRE_DISPLAY_NAMES } from '@/config/genres';

export function CollectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tutti');
  const [selectedYear, setSelectedYear] = useState(''); // stringa per input

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollection(id!).then((res) => res.data),
    enabled: !!id,
  });

  const { data: allMedia } = useQuery({
    queryKey: ['all-media'],
    queryFn: () => getMedia().then((res) => res.data),
    enabled: showAddModal,
  });

  const availableMediaFiltered = useMemo(() => {
    if (!allMedia || !collection) return [];
    const collectionMediaIds = new Set(
      collection.media?.map((item: any) => item.mediaId) || []
    );
    let available = allMedia.filter((m: any) => !collectionMediaIds.has(m.id));

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      available = available.filter((m: any) =>
        m.title.toLowerCase().includes(term)
      );
    }

    if (selectedGenre !== 'Tutti') {
      available = available.filter((m: any) => {
        if (selectedGenre === 'Serie TV') return m.type === 'EPISODE';
        if (selectedGenre === 'Altro') return !m.genres || m.genres.length === 0;
        return m.genres?.some((g: string) => {
          const display = GENRE_DISPLAY_NAMES[g] || g;
          return display === selectedGenre;
        });
      });
    }

    // Filtro per anno (se il campo contiene un numero valido)
    const yearNum = parseInt(selectedYear);
    if (selectedYear && !isNaN(yearNum)) {
      available = available.filter((m: any) => m.releaseYear === yearNum);
    }

    return available;
  }, [allMedia, collection, searchTerm, selectedGenre, selectedYear]);

  const updateCollectionMutation = useMutation({
    mutationFn: (data: {
      posterUrl?: string;
      backgroundUrl?: string;
      name?: string;
      description?: string;
    }) => updateCollection(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  const handleUploadImage = async (file: File, type: 'poster' | 'background') => {
    try {
      const response = await uploadCollectionImage(id!, file, type);
      const { url } = response.data;
      await updateCollectionMutation.mutateAsync(
        type === 'poster' ? { posterUrl: url } : { backgroundUrl: url }
      );
    } catch (err: any) {
      console.error('Errore upload immagine:', err);
      alert("Errore durante il caricamento dell'immagine.");
    }
  };

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => removeMediaFromCollection(id!, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (mediaId: string) => addMediaToCollection(id!, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setShowAddModal(false);
      setSearchTerm('');
      setSelectedGenre('Tutti');
      setSelectedYear('');
    },
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento...</div>
        </div>
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-red-500 text-xl">Collezione non trovata</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-16">
        <div
          className="w-full h-[50vh] bg-cover bg-center relative"
          style={{
            backgroundImage: collection.backgroundUrl
              ? `url(${collection.backgroundUrl})`
              : 'none',
            backgroundColor: collection.backgroundUrl ? 'transparent' : '#1a1a1a',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-red-700 text-gray-300 text-sm rounded-lg hover:bg-red-900 hover:text-white transition-colors border border-gray-700 hover:scale-105 mb-2 block"
            >
              ← Indietro
            </button>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed max-w-2xl">
                {collection.description}
              </p>
            )}
            <span className="text-gray-400 text-sm mt-2 block">
              {collection.media?.length || 0} film
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-netflix-red text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              + Aggiungi film
            </button>
            <button
              onClick={() => posterInputRef.current?.click()}
              className="px-4 py-2 bg-dark-800 text-gray-300 text-sm rounded-lg hover:bg-dark-700 hover:scale-105 hover:text-white transition-colors border border-gray-700"
            >
              Cambia locandina
            </button>
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadImage(file, 'poster');
                e.target.value = '';
              }}
            />
            <button
              onClick={() => backgroundInputRef.current?.click()}
              className="px-4 py-2 bg-dark-800 text-gray-300 text-sm rounded-lg hover:bg-dark-700 hover:scale-105 hover:text-white transition-colors border border-gray-700"
            >
              Cambia sfondo
            </button>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadImage(file, 'background');
                e.target.value = '';
              }}
            />
          </div>

          {collection.media && collection.media.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">Questa collezione è vuota.</p>
              <p className="text-sm mt-2">Aggiungi i tuoi film preferiti!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {collection.media.map((item: any) => {
                const media = item.media;
                const imageUrl = media.posterUrl
                  ? `/api/file/${encodeURIComponent(media.posterUrl)}`
                  : null;
                return (
                  <div key={media.id} className="relative group">
                    <Link to={`/movie/${media.id}`} className="block">
                      <div className="aspect-[2/3] bg-dark-700 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={media.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            🎬
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-white text-sm font-medium truncate">
                            {media.title}
                          </p>
                          {media.releaseYear && (
                            <p className="text-gray-400 text-xs">{media.releaseYear}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Rimuovere "${media.title}" dalla collezione?`)) {
                          removeMutation.mutate(media.id);
                        }
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              Aggiungi film a "{collection.name}"
            </h2>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Cerca per titolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-300 text-black 
                rounded border border-gray-600 
                focus:outline-none focus:border-gold"
              />

              <div className="flex gap-2">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-300 text-black 
                  rounded border border-orange-600 
                  hover:bg-dark-700 hover:text-gray-800
                  focus:outline-none focus:border-yellow-600 transition-colors"
                >
                  <option value="Tutti">Tutti i generi</option>
                  {ALL_GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                  <option value="Serie TV">Serie TV</option>
                  <option value="Altro">Altro</option>
                </select>

                <input
                  type="number"
                  placeholder="Anno"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-300 text-black 
                  rounded border border-gray-600 
                  focus:outline-none focus:border-green-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 bg-red-700 
              text-white text-sm rounded-lg 
              hover:bg-red-900 hover:text-white 
              transition-colors border border-gray-700 mb-3"
            >
              Chiudi
            </button>

            {availableMediaFiltered.length === 0 ? (
              <p className="text-gray-400">
                {allMedia ? 'Nessun film disponibile con questi filtri.' : 'Caricamento...'}
              </p>
            ) : (
              <div className="space-y-2">
                {availableMediaFiltered.map((media: any) => (
                  <div
                    key={media.id}
                    className="flex items-center justify-between bg-gray-800 rounded-lg p-3 hover:bg-dark-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {media.posterUrl ? (
                        <img
                          src={`/api/file/${encodeURIComponent(media.posterUrl)}`}
                          alt={media.title}
                          className="w-10 h-14 object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-dark-600 rounded flex items-center justify-center text-gray-500">
                          🎬
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">{media.title}</p>
                        {media.releaseYear && (
                          <p className="text-gray-400 text-xs">{media.releaseYear}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => addMutation.mutate(media.id)}
                      disabled={addMutation.isPending}
                      className="px-3 py-1 bg-netflix-red text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Aggiungi
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddModal(false)}
              className="mt-3 w-full px-4 py-2 bg-red-700 
              text-white text-sm rounded-lg 
              hover:bg-red-900 hover:text-white 
              transition-colors border border-gray-700 mb-3"
            >
              Chiudi
            </button>

          </div>
        </div>
      )}
    </>
  );
}