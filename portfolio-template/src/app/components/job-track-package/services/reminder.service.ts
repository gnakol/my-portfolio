import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Reminder,
  ReminderDashboard,
  CreateReminderDto,
  UpdateReminderDto,
  SnoozeReminderDto,
  CompleteReminderDto,
  ReminderWithDaysInfo,
  ReminderFilters,
} from '../models/reminder.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = `${environment.jobTrackApiUrl}/reminders`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // ============================================================================
  // DASHBOARD & STATISTICS
  // ============================================================================

  /**
   * Get dashboard data with summary and critical reminders
   */
  getDashboard(): Observable<ReminderDashboard> {
    const headers = this.getHeaders();
    return this.http.get<ReminderDashboard>(`${this.apiUrl}/dashboard`, { headers });
  }

  /**
   * Get all reminders with enhanced info (days overdue, etc.)
   */
  getAllRemindersEnhanced(
    page: number = 1,
    limit: number = 10,
    filters?: ReminderFilters
  ): Observable<PaginatedResponse<ReminderWithDaysInfo>> {
    const headers = this.getHeaders();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Add filters if provided
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        params = params.set('status', filters.status.join(','));
      }
      if (filters.priority && filters.priority.length > 0) {
        params = params.set('priority', filters.priority.join(','));
      }
      if (filters.reminderType && filters.reminderType.length > 0) {
        params = params.set('reminderType', filters.reminderType.join(','));
      }
      if (filters.isOverdue !== undefined) {
        params = params.set('isOverdue', filters.isOverdue.toString());
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
    }

    return this.http
      .get<PaginatedResponse<Reminder>>(`${this.apiUrl}`, { headers, params })
      .pipe(map((response) => this.enhanceRemindersWithDaysInfo(response)));
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all reminders with pagination
   */
  getAllReminders(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Reminder>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<Reminder>>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers,
    });
  }

  /**
   * Get reminders for a specific candidacy
   */
  getRemindersByCandidacy(candidacyId: number): Observable<Reminder[]> {
    const headers = this.getHeaders();
    return this.http.get<Reminder[]>(`${this.apiUrl}/candidacy/${candidacyId}`, { headers });
  }

  /**
   * Get reminder by ID
   */
  getReminderById(id: number): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.get<Reminder>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Create a new reminder
   */
  createReminder(reminder: CreateReminderDto): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.post<Reminder>(this.apiUrl, reminder, { headers });
  }

  /**
   * Update an existing reminder
   */
  updateReminder(id: number, reminder: UpdateReminderDto): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder, { headers });
  }

  /**
   * Delete a reminder
   */
  deleteReminder(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // ============================================================================
  // SMART ACTIONS
  // ============================================================================

  /**
   * Snooze a reminder (postpone it by X days)
   */
  snoozeReminder(id: number, snoozeDays: number): Observable<Reminder> {
    const headers = this.getHeaders();
    const body: SnoozeReminderDto = { snoozeDays };
    return this.http.post<Reminder>(`${this.apiUrl}/${id}/snooze`, body, { headers });
  }

  /**
   * Complete a reminder
   */
  completeReminder(id: number, comment?: string): Observable<Reminder> {
    const headers = this.getHeaders();
    const body: CompleteReminderDto = { comment };
    return this.http.post<Reminder>(`${this.apiUrl}/${id}/complete`, body, { headers });
  }

  /**
   * Cancel a reminder
   */
  cancelReminder(id: number): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.post<Reminder>(`${this.apiUrl}/${id}/cancel`, {}, { headers });
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Snooze multiple reminders at once
   */
  snoozeBulk(reminderIds: number[], snoozeDays: number): Observable<Reminder[]> {
    const headers = this.getHeaders();
    const body = { reminderIds, snoozeDays };
    return this.http.post<Reminder[]>(`${this.apiUrl}/bulk/snooze`, body, { headers });
  }

  /**
   * Complete multiple reminders at once
   */
  completeBulk(reminderIds: number[], comment?: string): Observable<Reminder[]> {
    const headers = this.getHeaders();
    const body = { reminderIds, comment };
    return this.http.post<Reminder[]>(`${this.apiUrl}/bulk/complete`, body, { headers });
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Enhance reminders with calculated days info
   */
  private enhanceRemindersWithDaysInfo(
    response: PaginatedResponse<Reminder>
  ): PaginatedResponse<ReminderWithDaysInfo> {
    const enhancedData = response.data.map((reminder) => this.calculateDaysInfo(reminder));
    return {
      ...response,
      data: enhancedData,
    };
  }

  /**
   * Calculate days info for a single reminder
   */
  calculateDaysInfo(reminder: Reminder): ReminderWithDaysInfo {
    const now = new Date();
    const dueDate = new Date(reminder.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const isToday = startOfToday.getTime() === startOfDueDate.getTime();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const isThisWeek = dueDate >= startOfWeek && dueDate <= endOfWeek;

    return {
      ...reminder,
      daysOverdue: diffDays < 0 ? Math.abs(diffDays) : undefined,
      daysUntilDue: diffDays > 0 ? diffDays : undefined,
      isOverdue: diffDays < 0,
      isToday,
      isThisWeek,
    };
  }

  /**
   * Get human-readable reminder type label
   */
  getReminderTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      FIRST_FOLLOW_UP: 'Première relance (J+5)',
      SECOND_FOLLOW_UP: 'Deuxième relance (J+10)',
      FINAL_FOLLOW_UP: 'Relance finale (J+15)',
      CUSTOM: 'Personnalisé',
      INTERVIEW: 'Entretien',
      DEADLINE: 'Date limite',
    };
    return labels[type] || type;
  }

  /**
   * Get human-readable status label
   */
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'En attente',
      SNOOZED: 'Reporté',
      COMPLETED: 'Complété',
      CANCELLED: 'Annulé',
      EXPIRED: 'Expiré',
    };
    return labels[status] || status;
  }

  /**
   * Get priority label
   */
  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      LOW: 'Faible',
      MEDIUM: 'Moyen',
      HIGH: 'Élevé',
      CRITICAL: 'Critique',
    };
    return labels[priority] || priority;
  }

  /**
   * Get color class for priority
   */
  getPriorityColorClass(priority?: string): string {
    if (!priority) return 'priority-medium';
    const colorClasses: { [key: string]: string } = {
      LOW: 'priority-low',
      MEDIUM: 'priority-medium',
      HIGH: 'priority-high',
      CRITICAL: 'priority-critical',
    };
    return colorClasses[priority] || 'priority-medium';
  }

  /**
   * Get color class for status
   */
  getStatusColorClass(status: string): string {
    const colorClasses: { [key: string]: string } = {
      PENDING: 'status-pending',
      SNOOZED: 'status-snoozed',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
      EXPIRED: 'status-expired',
    };
    return colorClasses[status] || 'status-pending';
  }
}
