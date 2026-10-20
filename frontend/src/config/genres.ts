// Mappatura per la visualizzazione (es. Musica → Concerti Live)
export const GENRE_DISPLAY_NAMES: Record<string, string> = {
  'Musica': 'Concerti Live',
  // Aggiungi altre mappature se necessario
};

// Categorie speciali (non TMDB)
export const SPECIAL_GENRES = ['Serie TV', 'Altro'];

// Lista di tutti i generi TMDB (senza speciali, solo nomi visualizzati)
export const ALL_GENRES = [
  'Azione', 'Avventura', 'Animazione', 'Commedia', 'Crime',
  'Documentario', 'Dramma', 'Famiglia', 'Fantasy', 'Storia',
  'Horror', 'Concerti Live', 'Mistero', 'Romance', 'Fantascienza',
  'Televisione Film', 'Thriller', 'Guerra', 'Western'
];