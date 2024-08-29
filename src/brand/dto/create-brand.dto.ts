import { IsOptional, IsString } from 'class-validator';

export class Brand {
  @IsOptional()
  name: string;

  @IsOptional()
  color_pallette: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  fonts: string;

  @IsString()
  @IsOptional()
  photography: string;

  @IsString()
  @IsOptional()
  illustration: string;

  @IsString()
  @IsOptional()
  strategy: string;
}
