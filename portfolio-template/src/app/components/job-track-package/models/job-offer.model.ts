export interface Company {
  id?: number;
  name: string;
  sector?: string;
  city?: string;
  country?: string;
  website?: string;
  personal_note?: string;
  recruiter_note?: string;
  created_at?: Date;
}

export interface JobOffer {
  id?: number;
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
  scrapedData?: any;
  createdAt?: Date;
  company?: Company;
  stackTags?: any[];
}

export interface ScrapeJobOfferRequest {
  url: string;
}

export interface ScrapedJobData {
  title: string;
  companyName?: string;
  companySector?: string;
  companyWebsite?: string;
  description?: string;
  locationCity?: string;
  locationCountry?: string;
  minSalary?: number;
  maxSalary?: number;
  typeOfContract?: string;
  experienceLevel?: string;
  remoteMode?: string;
  platform: string;
  sourceUrl: string;
  technologies?: string[];
  rawData?: any;
}
