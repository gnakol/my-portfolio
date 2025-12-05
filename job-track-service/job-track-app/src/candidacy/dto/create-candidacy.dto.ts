import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateCandidacyDto {
  @IsNumber()
  companyId: number;

  @IsOptional()
  @IsNumber()
  jobOfferId?: number;

  @IsDateString()
  applicationDate: string;

  @IsString()
  @MaxLength(50)
  currentStatus: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  applicationChannel?: string;

  @IsOptional()
  @IsNumber()
  expectedMinSalary?: number;

  @IsOptional()
  @IsNumber()
  expectedMaxSalary?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  levelOfInterest?: number;
}
