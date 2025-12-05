import { IsString, IsOptional, MaxLength, IsEmail, IsUrl } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  role?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(512)
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
