// modules/metadata-manager/dto/update-media-metadata.dto.ts
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO per PATCH /media/:id/metadata
 * Rappresenta i campi editabili dalla scheda "Modifica Metadati".
 * posterUrl/backgroundUrl NON sono qui: vengono gestiti dagli endpoint
 * di upload dedicati (POST /media/:id/metadata/poster|background).
 */
export class UpdateMediaMetadataDto {
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
  @IsInt()
  @Min(0)
  @Max(10000)
  @Type(() => Number)
  runtime?: number;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  @Type(() => Number)
  releaseYear?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  director?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  revenue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  @Type(() => Number)
  oscarAwards?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;
}