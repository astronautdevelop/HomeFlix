import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { MediaCard } from '@/components/common/MediaCard';
import { SeasonCard } from '@/components/common/SeasonCard';
import { getActorDetails, getActorMovies } from '@/services/api';

// Componente per la biografia richiudibile
function ExpandableBiography({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = 24;
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;
      setNeedsExpand(contentRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  if (!text || text.trim().length === 0) {
    return (
      <div className="mt-4">
        <h2 className="text-white font-semibold text-lg mb-1">Biografia</h2>
        <p className="text-gray-500 text-sm italic">Biografia non disponibile per questo attore.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-white font-semibold text-lg mb-1">Biografia</h2>
      <div className="relative">
        <p
          ref={contentRef}
          className={`text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl transition-all duration-300 ${
            !isExpanded ? 'line-clamp-6' : ''
          }`}
        >
          {text}
        </p>
        {needsExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors focus:outline-none"
          >
            {isExpanded ? 'Mostra meno ▲' : 'Mostra di più ▼'}
          </button>
        )}
      </div>
    </div>
  );
}

export function ActorDetails() {
  const { name } = useParams<{ name: string }>();
  const actorName = decodeURIComponent(name || '');

  const { data: details, isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['actor', actorName, 'details'],
    queryFn: () => getActorDetails(actorName),
    enabled: !!actorName,
    retry: false,
  });

  const { data: filmography, isLoading: moviesLoading } = useQuery({
    queryKey: ['actor', actorName, 'movies'],
    queryFn: () => getActorMovies(actorName),
    enabled: !!actorName && !!details,
  });

  // Caso di caricamento
  if (detailsLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-white">Caricamento attore...</div>
        </div>
      </>
    );
  }

  // Caso attore non trovato (dettagli null o errore 404)
  if (!details || detailsError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-white mb-2">Attore non trovato</h1>
            <p className="text-gray-400">
              Non è stato possibile trovare informazioni per "{actorName}" su TMDB.
            </p>
            <Link to="/" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
              Torna alla Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const flagUrl = details.countryCode
    ? `/flags/${details.countryCode.toLowerCase()}.png`
    : '/flags/default.png';

  // 🔥 Separa film e stagioni TV
  const allItems: any[] = Array.isArray(filmography) ? filmography : [];
  const moviesList = allItems.filter((item) => item.type !== 'SEASON');
  const seasonsList = allItems.filter((item) => item.type === 'SEASON');
  const hasAnything = moviesList.length > 0 || seasonsList.length > 0;

  return (
    <>
      <Header />
      <div className="pt-16">
        {/* Banner con bandiera - dimensioni come category banner */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-dark-900 flex items-center justify-center overflow-hidden">
          <img
            src={flagUrl}
            alt={details.countryCode ? `Bandiera ${details.countryCode}` : 'Bandiera non disponibile'}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              e.currentTarget.src = '/flags/default.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20 md:-mt-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto profilo */}
            <div className="w-40 md:w-56 flex-shrink-0">
              <img
                src={`/api/actor/${encodeURIComponent(actorName)}/image`}
                alt={details.name}
                className="w-full rounded-lg shadow-2xl border-2 border-dark-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default/poster.jpg';
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {details.name}
              </h1>

              <div className="mt-2 space-y-1 text-gray-300 text-sm md:text-base">
                {details.birthday && (
                  <p>
                    <span className="text-gray-400">Nato:</span>{' '}
                    {new Date(details.birthday).toLocaleDateString('it-IT')}
                  </p>
                )}
                {details.placeOfBirth && (
                  <p>
                    <span className="text-gray-400">Luogo:</span> {details.placeOfBirth}
                  </p>
                )}
                {details.deathday && (
                  <p>
                    <span className="text-gray-400">Deceduto:</span>{' '}
                    {new Date(details.deathday).toLocaleDateString('it-IT')}
                  </p>
                )}
                {details.alsoKnownAs && details.alsoKnownAs.length > 0 && (
                  <p>
                    <span className="text-gray-400">Conosciuto anche come:</span>{' '}
                    {details.alsoKnownAs.join(', ')}
                  </p>
                )}
              </div>

              {/* Biografia richiudibile */}
              <ExpandableBiography text={details.biography} />
            </div>
          </div>

          {/* Filmografia */}
          <div className="mt-8">
            {moviesLoading ? (
              <div className="text-gray-400">Caricamento filmografia...</div>
            ) : !hasAnything ? (
              <div className="text-gray-400">Nessun contenuto trovato per questo attore.</div>
            ) : (
              <>
                {/* Sezione FILM */}
                {moviesList.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-white font-semibold text-xl mb-4">Film</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {moviesList.map((movie: any) => (
                        <MediaCard key={movie.id} media={movie} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sezione SERIE TV (una card per stagione) */}
                {seasonsList.length > 0 && (
                  <div>
                    <h2 className="text-white font-semibold text-xl mb-4">Serie TV</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {seasonsList.map((season: any) => (
                        <SeasonCard key={season.id} season={season} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}