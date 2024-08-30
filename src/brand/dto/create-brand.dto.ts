import { IsOptional } from 'class-validator';

export class Brand {
  @IsOptional()
  name: string;

  @IsOptional()
  color_pallette: string;

  @IsOptional()
  logo: string;

  @IsOptional()
  fonts: string;

  @IsOptional()
  photography: string;

  @IsOptional()
  illustration: string;

  @IsOptional()
  strategy: string;

  @IsOptional()
  pattern: string;

  @IsOptional()
  messaging: string;
}
