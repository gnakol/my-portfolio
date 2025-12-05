export class CompanyResponseDto {
  id: number;
  name: string;
  sector?: string;
  city?: string;
  country?: string;
  website?: string;
  personal_note?: string;
  recruiter_note?: string;
  created_at: Date;
}
