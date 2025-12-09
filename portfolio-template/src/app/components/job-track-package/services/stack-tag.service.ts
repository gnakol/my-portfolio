import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StackTag, CreateStackTagRequest } from '../models/stack-tag.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class StackTagService {
  private apiUrl = `${environment.jobTrackApiUrl}/stack-tags`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all stack tags with pagination
  getAllStackTags(page: number = 1, limit: number = 10): Observable<PaginatedResponse<StackTag>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<StackTag>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get stack tag by ID
  getStackTagById(id: number): Observable<StackTag> {
    const headers = this.getHeaders();
    return this.http.get<StackTag>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create stack tag
  createStackTag(stackTag: CreateStackTagRequest): Observable<StackTag> {
    const headers = this.getHeaders();
    return this.http.post<StackTag>(this.apiUrl, stackTag, { headers });
  }

  // Update stack tag
  updateStackTag(id: number, stackTag: Partial<StackTag>): Observable<StackTag> {
    const headers = this.getHeaders();
    return this.http.put<StackTag>(`${this.apiUrl}/${id}`, stackTag, { headers });
  }

  // Delete stack tag
  deleteStackTag(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
