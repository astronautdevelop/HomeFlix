// Risposta della ricerca di un film su TMDB
export interface TmdbMovieSearchResponse {
  page: number;
  results: TmdbMovieResult[];
  total_results: number;
  total_pages: number;
}

export interface TmdbMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime?: number;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { iso_639_1: string; name: string }[];
  revenue?: number;
  budget?: number;
}

// Risposta dei dettagli di un film
export interface TmdbMovieDetails extends TmdbMovieResult {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path?: string | null;
    }[];
    crew: {
      name: string;
      job: string;
    }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
  images?: {
    posters: { file_path: string }[];
    backdrops: { file_path: string }[];
    logos?: { file_path: string }[];
  };
}

// Risposta della ricerca di una serie TV
export interface TmdbSeriesSearchResponse {
  page: number;
  results: TmdbSeriesResult[];
  total_results: number;
  total_pages: number;
}

export interface TmdbSeriesResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

// 🔥 Dettagli serie TV — AGGIUNTI credits, videos, images
export interface TmdbSeriesDetails extends TmdbSeriesResult {
  seasons: {
    season_number: number;
    name: string;
    overview: string;
    poster_path: string | null;
    air_date: string;
    episode_count: number;
  }[];
  created_by: { name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path?: string | null;
    }[];
    crew: {
      name: string;
      job: string;
    }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
  images?: {
    posters: { file_path: string }[];
    backdrops: { file_path: string }[];
    logos?: { file_path: string }[];
  };
}

// Dettagli episodio
export interface TmdbEpisodeDetails {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime?: number;
}