export interface Candidacy {
  id?: number;
  companyId: number;
  jobOfferId?: number;
  applicationDate: Date;
  currentStatus: CandidacyStatus;
  applicationChannel?: string;
  expectedMinSalary?: number;
  expectedMaxSalary?: number;
  note?: string;
  levelOfInterest?: number;
  createdAt?: Date;
  company?: any;
  jobOffer?: any;
  reminders?: any[];
  events?: any[];
}

export enum CandidacyStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PHONE_SCREENING = 'PHONE_SCREENING',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface CreateCandidacyRequest {
  companyId: number;
  jobOfferId?: number;
  applicationDate: string;
  currentStatus: CandidacyStatus;
  applicationChannel?: string;
  expectedMinSalary?: number;
  expectedMaxSalary?: number;
  note?: string;
  levelOfInterest?: number;
}
