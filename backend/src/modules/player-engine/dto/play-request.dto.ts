export class PlayRequestDto {
  mediaId: string;
  quality?: string; // '1080p', '4K', '720p', ecc.
}

export class QualityInfoDto {
  quality: string;
  filePath: string;
  size: number;
  mimeType: string;
}

export class MediaInfoDto {
  id: string;
  title: string;
  type: string;
  qualities: QualityInfoDto[];
}