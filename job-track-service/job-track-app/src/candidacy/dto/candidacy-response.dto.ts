import { CompanyResponseDto } from '../../company/dto';

export class JobOfferResponseDto {
  id: number;
  title?: string;
  description?: string;
  companyId?: number;
  offerUrl?: string;
  platform?: string;
  locationCity?: string;
  locationCountry?: string;
  minSalary?: number;
  maxSalary?: number;
  typeOfContract?: string;
  experienceLevel?: string;
  remoteMode?: string;
  publicationDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;
}

export class CandidacyResponseDto {
  id: number;
  companyId: number;
  jobOfferId?: number;
  applicationDate: Date;
  currentStatus: string;
  applicationChannel?: string;
  expectedMinSalary?: number;
  expectedMaxSalary?: number;
  note?: string;
  levelOfInterest?: number;
  createdAt: Date;
  company?: CompanyResponseDto;
  jobOffer?: JobOfferResponseDto;
}
