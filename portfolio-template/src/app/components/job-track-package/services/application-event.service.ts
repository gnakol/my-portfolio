import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApplicationEvent, CreateApplicationEventRequest } from '../models/application-event.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEventService {
  private apiUrl = `${environment.jobTrackApiUrl}/application-events`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all application events with pagination
  getAllApplicationEvents(page: number = 1, limit: number = 10): Observable<PaginatedResponse<ApplicationEvent>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<ApplicationEvent>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get application events for a specific candidacy
  getEventsByCandidacy(candidacyId: number): Observable<ApplicationEvent[]> {
    const headers = this.getHeaders();
    return this.http.get<ApplicationEvent[]>(`${this.apiUrl}/candidacy/${candidacyId}`, { headers });
  }

  // Get application event by ID
  getApplicationEventById(id: number): Observable<ApplicationEvent> {
    const headers = this.getHeaders();
    return this.http.get<ApplicationEvent>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create application event
  createApplicationEvent(event: CreateApplicationEventRequest): Observable<ApplicationEvent> {
    const headers = this.getHeaders();
    return this.http.post<ApplicationEvent>(this.apiUrl, event, { headers });
  }

  // Update application event
  updateApplicationEvent(id: number, event: Partial<ApplicationEvent>): Observable<ApplicationEvent> {
    const headers = this.getHeaders();
    return this.http.put<ApplicationEvent>(`${this.apiUrl}/${id}`, event, { headers });
  }

  // Delete application event
  deleteApplicationEvent(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
