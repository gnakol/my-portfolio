import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Candidacy, CreateCandidacyRequest } from '../models/candidacy.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CandidacyService {
  private apiUrl = `${environment.jobTrackApiUrl}/candidacies`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all candidacies with pagination
  getAllCandidacies(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Candidacy>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<Candidacy>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get candidacy by ID
  getCandidacyById(id: number): Observable<Candidacy> {
    const headers = this.getHeaders();
    return this.http.get<Candidacy>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create candidacy (auto-creates 3 reminders J+3, J+7, J+14)
  createCandidacy(candidacy: CreateCandidacyRequest): Observable<Candidacy> {
    const headers = this.getHeaders();
    return this.http.post<Candidacy>(this.apiUrl, candidacy, { headers });
  }

  // Update candidacy
  updateCandidacy(id: number, candidacy: Partial<Candidacy>): Observable<Candidacy> {
    const headers = this.getHeaders();
    return this.http.put<Candidacy>(`${this.apiUrl}/${id}`, candidacy, { headers });
  }

  // Delete candidacy
  deleteCandidacy(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
