import { IsNotEmpty, IsString } from 'class-validator';

export class GetBrandDto {
  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  niche: string;
}

export class GetBrandStrategyDto extends GetBrandDto {
  @IsString()
  @IsNotEmpty()
  country: string;
}
