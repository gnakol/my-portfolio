import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JobOffer, ScrapeJobOfferRequest, ScrapedJobData } from '../models/job-offer.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.jobTrackApiUrl}/job-offers`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all job offers with pagination
  getAllJobOffers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<JobOffer>> {
    const headers = this.getHeaders();
    return this.http.get<PaginatedResponse<JobOffer>>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  // Get job offer by ID
  getJobOfferById(id: number): Observable<JobOffer> {
    const headers = this.getHeaders();
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create job offer
  createJobOffer(jobOffer: Partial<JobOffer>): Observable<JobOffer> {
    const headers = this.getHeaders();
    return this.http.post<JobOffer>(this.apiUrl, jobOffer, { headers });
  }

  // Update job offer
  updateJobOffer(id: number, jobOffer: Partial<JobOffer>): Observable<JobOffer> {
    const headers = this.getHeaders();
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, jobOffer, { headers });
  }

  // Delete job offer
  deleteJobOffer(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // Scrape job offer from URL
  scrapeJobOffer(request: ScrapeJobOfferRequest): Observable<ScrapedJobData> {
    const headers = this.getHeaders();
    return this.http.post<ScrapedJobData>(`${this.apiUrl}/scrape`, request, { headers });
  }
}
