export interface Contact {
  id?: number;
  companyId: number;
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  createdAt?: Date;
  company?: any;
}

export interface CreateContactRequest {
  companyId: number;
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
}
