export class MetadataDto {
  id?: string;
  title: string;
  originalTitle?: string;
  plot?: string;
  runtime?: number;
  releaseYear?: number;
  genres?: string[];
  actors?: string[];
  director?: string;
  country?: string;
  language?: string;
  revenue?: number;
  oscarAwards?: number;
  rating?: number;
  trailerUrl?: string;
  posterUrl?: string;
  backgroundUrl?: string;
  logoUrl?: string;
  metadataSource?: 'local' | 'tmdb' | 'default';
}

export class UpdateMetadataResponse {
  success: boolean;
  message: string;
  mediaId: string;
  metadataSource: string;
}