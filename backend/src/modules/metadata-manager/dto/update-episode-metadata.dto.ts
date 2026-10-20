// modules/metadata-manager/dto/update-episode-metadata.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO per PATCH /media/episodes/:id/metadata
 * Campi editabili dalla scheda "Modifica Metadati" degli episodi personali.
 * Genere, Cast, Regista, Anno, Lingua sono ereditati dalla Serie.
 * Il background è gestito dall'endpoint di upload dedicato.
 */
export class UpdateEpisodeMetadataDto {
  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  originalTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  plot?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  @Type(() => Number)
  runtime?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}