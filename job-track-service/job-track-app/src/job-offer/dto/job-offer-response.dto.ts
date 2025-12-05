export class JobOfferResponseDto {
  id: number;
  companyId: number;
  title: string;
  description?: string;
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
  scrapedData?: Record<string, any>;
  createdAt: Date;
}
