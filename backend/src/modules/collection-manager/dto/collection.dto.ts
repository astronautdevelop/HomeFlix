export class CreateCollectionDto {
  name: string;
  description?: string;
  posterUrl?: string;
  backgroundUrl?: string;
}

export class UpdateCollectionDto {
  name?: string;
  description?: string;
  posterUrl?: string;
  backgroundUrl?: string;
}

export class AddMediaToCollectionDto {
  mediaId: string;
  order?: number;
}

export class UpdateOrderDto {
  mediaIds: string[]; // array di ID media nell'ordine desiderato
}

export class CollectionResponseDto {
  id: string;
  name: string;
  description?: string;
  posterUrl?: string;
  backgroundUrl?: string;
  mediaCount: number;
  createdAt: Date;
  updatedAt: Date;
  media?: any[];
}