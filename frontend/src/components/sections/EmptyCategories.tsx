import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyCategoriesProps {
  categories: { genre: string; count: number }[];
}

const getCategoryEmoji = (genre: string): string => {
  const emojis: Record<string, string> = {
    'Concerti Live': '🎵',
    'Azione': '⚔️',
    'Avventura': '🗺️',
    'Animazione': '🎨',
    'Commedia': '😂',
    'Crime': '🔫',
    'Documentario': '🎥',
    'Dramma': '🎭',
    'Famiglia': '👨‍👩‍👧‍👦',
    'Fantascienza': '🚀',
    'Fantasy': '🧙',
    'Guerra': '⚔️',
    'Horror': '👻',
    'Mistero': '🔍',
    'Romance': '❤️',
    'Storia': '📜',
    'Televisione Film': '📺',
    'Thriller': '🔪',
    'Western': '🤠',
    'Serie TV': '📺',
    'Altro': '📁',
  };
  return emojis[genre] || '🎬';
};

export function EmptyCategories({ categories }: EmptyCategoriesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-6 border-t border-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">📭</span>
        <span className="text-sm text-gray-400 font-medium">Categorie vuote</span>
        <span className="text-xs text-gray-600">({categories.length})</span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map(({ genre }) => (
          <Link
            key={genre}
            to={`/genre/${encodeURIComponent(genre)}`}
            className="group flex items-center 
            gap-2 px-4 py-2 bg-dark-800/50 hover:bg-dark-800 
            rounded-full border border-gray-700/30 
            hover:border-gray-600 transition-all duration-200"
          >
            <span className="text-lg">{getCategoryEmoji(genre)}</span>
            <span className="text-sm text-gray-400 
            group-hover:text-white transition-colors">
              {genre}
            </span>
            <span className="text-xs text-gray-600">(0)</span>
          </Link>
        ))}
      </div>
    </div>
  );
}