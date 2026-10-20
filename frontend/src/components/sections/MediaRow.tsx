import React from 'react';
import { Link } from 'react-router-dom';
import { MediaCard } from '../common/MediaCard';
import { SeasonCard } from '../common/SeasonCard';

interface MediaRowProps {
  title: string;
  genre: string;
  media: any[]; // misto: film (type='MOVIE') e stagioni (type='SEASON')
  count?: number;
  isLoading?: boolean;
}

export function MediaRow({ title, genre, media }: MediaRowProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white font-monday">{title}</h2>
        <Link
          to={`/genre/${encodeURIComponent(genre)}`}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gray-700 border border-gray-400/60 hover:bg-gray-500 hover:scale-105 transition-all duration-200"
        >
          Vedi tutti
          <span className="text-lg leading-none">→</span>
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {media.map((item) =>
          item.type === 'SEASON' ? (
            <SeasonCard key={item.id} season={item} />
          ) : (
            <MediaCard key={item.id} media={item} />
          ),
        )}
      </div>
    </div>
  );
}