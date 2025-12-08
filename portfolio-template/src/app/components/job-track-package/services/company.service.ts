import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Company, CreateCompanyRequest } from '../models/company.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.jobTrackApiUrl}/companies`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all companies with pagination
  getAllCompanies(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Company>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<Company>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get company by ID
  getCompanyById(id: number): Observable<Company> {
    const headers = this.getHeaders();
    return this.http.get<Company>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create company
  createCompany(company: CreateCompanyRequest): Observable<Company> {
    const headers = this.getHeaders();
    return this.http.post<Company>(this.apiUrl, company, { headers });
  }

  // Update company
  updateCompany(id: number, company: Partial<Company>): Observable<Company> {
    const headers = this.getHeaders();
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company, { headers });
  }

  // Delete company
  deleteCompany(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
