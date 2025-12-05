export class ContactResponseDto {
  id: number;
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  createdAt: Date;
}
