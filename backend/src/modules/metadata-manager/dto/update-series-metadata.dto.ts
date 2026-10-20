// modules/metadata-manager/dto/update-series-metadata.dto.ts
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
 * DTO per PATCH /media/series/:seriesId/metadata
 * Campi editabili dalla scheda "Modifica Metadati" delle serie personali.
 * posterUrl/backgroundUrl NON sono qui: gestiti dagli endpoint di upload.
 */
export class UpdateSeriesMetadataDto {
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
  @Min(0)
  @Max(10)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  @Type(() => Number)
  releaseYear?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  @Type(() => Number)
  runtime?: number;
}