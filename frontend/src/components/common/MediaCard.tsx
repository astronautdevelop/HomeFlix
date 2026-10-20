import React from 'react';
import { Link } from 'react-router-dom';

interface MediaCardProps {
  media: any;
  className?: string;
}

export function MediaCard({ media, className = '' }: MediaCardProps) {
  const posterUrl = `/media/image/${media.id}?type=poster`;
  const isAvailable = media.available !== false; // default true

  return (
    <Link to={`/movie/${media.id}`} className={`flex-shrink-0 w-40 ${className}`}>
      <div className="aspect-[2/3] bg-gray-800 rounded overflow-hidden relative">
        <img
          src={posterUrl}
          alt={media.title}
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isAvailable ? 'hover:scale-105' : ''
          }`}
          style={{ opacity: isAvailable ? 1 : 0.6 }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/default/poster.jpg';
          }}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-xs font-bold bg-red-600/80 px-2 py-1 rounded">
              ⚠️ DISCO NON COLLEGATO
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-300 mt-1 truncate">{media.title}</p>
      {media.releaseYear && (
        <p className="text-xs text-gray-500">{media.releaseYear}</p>
      )}
    </Link>
  );
}