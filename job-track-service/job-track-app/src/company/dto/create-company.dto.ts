import { IsString, IsOptional, MaxLength, IsUrl, ValidateIf } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  sector?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  country?: string;

  @IsOptional()
  @ValidateIf((o) => o.website && o.website.trim() !== '')
  @IsUrl({}, { message: 'website must be a valid URL address' })
  @MaxLength(512)
  website?: string;

  @IsOptional()
  @IsString()
  personal_note?: string;

  @IsOptional()
  @IsString()
  recruiter_note?: string;
}
