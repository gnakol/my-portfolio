import { IsString, IsOptional } from 'class-validator';

export class CompleteReminderDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
