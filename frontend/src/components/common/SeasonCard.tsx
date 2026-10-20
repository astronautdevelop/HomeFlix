import React from 'react';
import { Link } from 'react-router-dom';
import { getSeriesImage } from '../../services/api';

interface SeasonCardProps {
  season: any;
  className?: string;
}

export function SeasonCard({ season, className = '' }: SeasonCardProps) {
  // 🔥 Usa l'id della SERIE per le immagini
  const posterUrl = season.seriesId
    ? getSeriesImage(season.seriesId, 'poster')
    : '/assets/default/poster.jpg';

  const seriesTitle = season.seriesTitle || season.title || 'Serie TV';
  const seasonNumber = season.seasonNumber || 1;
  const episodesCount = season.episodesCount || 0;

  return (
    <Link
      to={`/season/${season.id}`}
      className={`flex-shrink-0 w-40 ${className}`}
    >
      <div className="aspect-[2/3] bg-gray-800 rounded overflow-hidden relative">
        <img
          src={posterUrl}
          alt={`${seriesTitle} - Stagione ${seasonNumber}`}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/default/poster.jpg';
          }}
        />
        {/* Badge Stagione */}
        <div className="absolute top-2 left-2 bg-black/80 text-gold text-xs font-bold px-2 py-1 rounded">
          S{seasonNumber}
        </div>
        {/* Badge numero episodi */}
        {episodesCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
            {episodesCount} {episodesCount === 1 ? 'ep' : 'ep'}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-300 mt-1 truncate">{seriesTitle}</p>
      <p className="text-xs text-gray-500">
        Stagione {seasonNumber}
        {season.releaseYear ? ` · ${season.releaseYear}` : ''}
      </p>
    </Link>
  );
}