import React from 'react';
import { Link } from 'react-router-dom';
import { SeasonCard } from '../common/SeasonCard';

interface SeasonRowProps {
  title: string;
  seasons: any[];
}

export function SeasonRow({ title, seasons }: SeasonRowProps) {
  if (!seasons || seasons.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white font-monday">{title}</h2>
        <Link
          to="/genre/Serie%20TV"
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gray-700 border border-gray-400/60 hover:bg-gray-500 hover:scale-105 transition-all duration-200"
        >
          Vedi tutte
          <span className="text-lg leading-none">→</span>
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {seasons.slice(0, 10).map((season) => (
          <SeasonCard key={season.id} season={season} />
        ))}
      </div>
    </div>
  );
}