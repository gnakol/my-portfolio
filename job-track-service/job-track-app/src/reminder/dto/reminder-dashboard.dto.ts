import { ReminderResponseDto } from './reminder-response.dto';

export class ReminderDashboardDto {
  summary: {
    total: number;
    overdue: number;
    today: number;
    thisWeek: number;
    upcoming: number;
  };

  byPriority: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };

  byCandidacyStatus: { [key: string]: number };

  criticalReminders: ReminderResponseDto[];

  // Listes filtrées pour l'affichage interactif
  overdueReminders: ReminderResponseDto[];
  todayReminders: ReminderResponseDto[];
  thisWeekReminders: ReminderResponseDto[];
  upcomingReminders: ReminderResponseDto[];
}
