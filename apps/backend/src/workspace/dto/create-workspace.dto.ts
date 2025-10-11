import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
