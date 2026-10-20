import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCollections } from '@/services/api';

export function CollectionsSection() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => getCollections().then((res) => res.data), // 🔥 Estrai .data qui
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">📚 Le mie Collezioni</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-48 h-32 bg-dark-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">📚 Le mie Collezioni</h2>
        <Link
          to="/collections"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Vedi tutte →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {collections.map((collection: any) => {
          const imageUrl = collection.posterUrl || null;

          return (
            <Link
              key={collection.id}
              to={`/collection/${collection.id}`}
              className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden relative group transition-transform hover:scale-105 duration-200"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-dark-800 flex items-center justify-center text-4xl text-gray-500">
                  📚
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm truncate">{collection.name}</p>
                <p className="text-gray-300 text-xs">
                  {collection._count?.media || 0} film
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}