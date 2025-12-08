import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reminder, CreateReminderRequest } from '../models/reminder.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = `${environment.jobTrackApiUrl}/reminders`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all reminders with pagination
  getAllReminders(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Reminder>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<Reminder>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get reminders for a specific candidacy
  getRemindersByCandidacy(candidacyId: number): Observable<Reminder[]> {
    const headers = this.getHeaders();
    return this.http.get<Reminder[]>(`${this.apiUrl}/candidacy/${candidacyId}`, { headers });
  }

  // Get reminder by ID
  getReminderById(id: number): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.get<Reminder>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create reminder
  createReminder(reminder: CreateReminderRequest): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.post<Reminder>(this.apiUrl, reminder, { headers });
  }

  // Update reminder
  updateReminder(id: number, reminder: Partial<Reminder>): Observable<Reminder> {
    const headers = this.getHeaders();
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder, { headers });
  }

  // Delete reminder
  deleteReminder(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
