export interface ApplicationEvent {
  id?: number;
  candidacyId: number;
  eventDate: Date;
  eventType: EventType;
  channel?: string;
  comment?: string;
  createdAt?: Date;
  candidacy?: any;
}

export enum EventType {
  PHONE_CALL = 'PHONE_CALL',
  EMAIL = 'EMAIL',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTION = 'REJECTION',
  FOLLOW_UP = 'FOLLOW_UP',
  TECHNICAL_TEST = 'TECHNICAL_TEST',
  OTHER = 'OTHER'
}

export interface CreateApplicationEventRequest {
  candidacyId: number;
  eventDate: string;
  eventType: EventType;
  channel?: string;
  comment?: string;
}
