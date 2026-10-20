import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTmdbKeyDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}