import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getCollections, deleteCollection, createCollection } from '@/services/api';
import { Header } from '@/components/common/Header';

export function Collections() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: () => getCollections().then((res) => res.data), // 🔥 Estrai .data qui
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCollection({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setShowCreateModal(false);
      setNewCollectionName('');
    },
    onError: (err: any) => {
      console.error('Errore creazione collezione:', err);
      alert('Errore durante la creazione della collezione.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (err: any) => {
      console.error('Errore eliminazione collezione:', err);
      alert("Errore durante l'eliminazione della collezione.");
    },
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white text-xl">Caricamento collezioni...</div>
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

  const safeCollections = collections || [];

  return (
    <>
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white font-monday">📚 Le mie Collezioni</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nuova Collezione
            </button>
          </div>

          {safeCollections.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">Non hai ancora creato collezioni.</p>
              <p className="text-sm mt-2">Clicca su "Nuova Collezione" per iniziare.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {safeCollections.map((collection: any) => {
                const imageUrl = collection.posterUrl || null;

                return (
                  <div
                    key={collection.id}
                    className="bg-dark-800 rounded-lg overflow-hidden group"
                  >
                    <Link to={`/collection/${collection.id}`}>
                      <div className="aspect-[2/3] bg-dark-700 relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">
                            📚
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-white font-bold text-sm truncate">
                            {collection.name}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {collection._count?.media || 0} film
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="p-2 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Eliminare la collezione "${collection.name}"?`)) {
                            deleteMutation.mutate(collection.id);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg 
                        text-sm font-medium text-white 
                        bg-red-700 border border-gray-400/60 
                        hover:bg-red-900 hover:scale-105 
                        transition-all duration-200"
                      >
                        ELIMINA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Nuova Collezione</h2>
            <input
              type="text"
              placeholder="Nome della collezione"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full bg-dark-700 text-white border 
              border-gray-600 rounded-lg px-4 py-2 mb-4 
              focus:outline-none focus:border-gold"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCollectionName('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                Annulla
              </button>
              <button
                onClick={() => createMutation.mutate(newCollectionName)}
                disabled={!newCollectionName.trim() || createMutation.isPending}
                className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creazione...' : 'Crea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}