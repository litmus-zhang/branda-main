import { IsNotEmpty, IsString } from 'class-validator';

export class GetBrandDto {
  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  niche: string;
}
