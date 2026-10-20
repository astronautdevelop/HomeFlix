// Lista completa dei generi TMDB (ID → Nome)
export const TMDB_GENRES: Record<number, string> = {
  28: 'Azione',
  12: 'Avventura',
  16: 'Animazione',
  35: 'Commedia',
  80: 'Crime',
  99: 'Documentario',
  18: 'Dramma',
  10751: 'Famiglia',
  14: 'Fantasy',
  36: 'Storia',
  27: 'Horror',
  10402: 'Musica',        // ⚠️ Verrà mappato in "Concerti Live"
  9648: 'Mistero',
  10749: 'Romance',
  878: 'Fantascienza',
  10770: 'Televisione Film',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western',
};

// Mappatura per la visualizzazione (es. Musica → Concerti Live)
export const GENRE_DISPLAY_NAMES: Record<string, string> = {
  'Musica': 'Concerti Live',
  // Aggiungi altre mappature se necessario
};

// Categorie speciali (non TMDB)
export const SPECIAL_GENRES = ['Serie TV', 'Altro'];

// Lista di tutti i generi TMDB in ordine alfabetico per la visualizzazione
export const ALL_GENRES = Object.values(TMDB_GENRES)
  .map(g => GENRE_DISPLAY_NAMES[g] || g)
  .sort();

// Lista completa con tutte le categorie (TMDB + Speciali)
export const ALL_CATEGORIES = [...ALL_GENRES, ...SPECIAL_GENRES];