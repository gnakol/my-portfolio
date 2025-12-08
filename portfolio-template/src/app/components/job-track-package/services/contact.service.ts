import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Contact, CreateContactRequest } from '../models/contact.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.jobTrackApiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all contacts with pagination
  getAllContacts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Contact>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<Contact>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get contact by ID
  getContactById(id: number): Observable<Contact> {
    const headers = this.getHeaders();
    return this.http.get<Contact>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create contact
  createContact(contact: CreateContactRequest): Observable<Contact> {
    const headers = this.getHeaders();
    return this.http.post<Contact>(this.apiUrl, contact, { headers });
  }

  // Update contact
  updateContact(id: number, contact: Partial<Contact>): Observable<Contact> {
    const headers = this.getHeaders();
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact, { headers });
  }

  // Delete contact
  deleteContact(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
