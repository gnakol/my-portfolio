import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  MaxLength,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreateJobOfferDto {
  @IsNumber()
  companyId: number;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  offerUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  platform?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationCountry?: string;

  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  typeOfContract?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  remoteMode?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsObject()
  scrapedData?: Record<string, any>;
}
