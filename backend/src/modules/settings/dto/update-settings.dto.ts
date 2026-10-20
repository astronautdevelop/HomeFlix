import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  tmdbApiKey?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaRoots?: string[];
}