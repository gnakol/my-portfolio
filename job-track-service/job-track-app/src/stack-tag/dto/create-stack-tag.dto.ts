import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateStackTagDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tagType?: string;
}
