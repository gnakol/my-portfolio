import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StatisticsOverview, StackStatistics, LocationStatistics, PlatformStatistics } from '../models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.jobTrackApiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get overview statistics
  getOverview(startDate?: string, endDate?: string): Observable<StatisticsOverview> {
    const headers = this.getHeaders();
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<StatisticsOverview>(`${this.apiUrl}/overview`, { headers, params });
  }

  // Get statistics by technology stack
  getByStack(): Observable<StackStatistics> {
    const headers = this.getHeaders();
    return this.http.get<StackStatistics>(`${this.apiUrl}/by-stack`, { headers });
  }

  // Get statistics by location
  getByLocation(): Observable<LocationStatistics> {
    const headers = this.getHeaders();
    return this.http.get<LocationStatistics>(`${this.apiUrl}/by-location`, { headers });
  }

  // Get statistics by platform (WTTJ, LinkedIn, Indeed, etc.)
  getByPlatform(): Observable<PlatformStatistics> {
    const headers = this.getHeaders();
    return this.http.get<PlatformStatistics>(`${this.apiUrl}/by-platform`, { headers });
  }
}
