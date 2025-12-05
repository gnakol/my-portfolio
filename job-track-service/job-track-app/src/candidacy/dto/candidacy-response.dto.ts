import { CompanyResponseDto } from '../../company/dto';

export class JobOfferResponseDto {
  id: number;
  title?: string;
  description?: string;
  companyId?: number;
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
