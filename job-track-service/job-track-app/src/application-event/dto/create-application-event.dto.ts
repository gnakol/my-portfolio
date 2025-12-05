import { IsNumber, IsString, IsOptional, MaxLength, IsDateString } from 'class-validator';

export class CreateApplicationEventDto {
  @IsNumber()
  candidacyId: number;

  @IsDateString()
  eventDate: string;

  @IsString()
  @MaxLength(50)
  eventType: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  channel?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
