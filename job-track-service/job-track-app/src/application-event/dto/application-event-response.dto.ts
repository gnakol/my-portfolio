export class ApplicationEventResponseDto {
  id: number;
  candidacyId: number;
  eventDate: Date;
  eventType: string;
  channel?: string;
  comment?: string;
  createdAt: Date;
}
