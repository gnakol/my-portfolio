// log-security.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogSecurityResponse } from '../log-security.model';
import { GenericMethodeService } from '../../../services/generic-methode.service';

@Injectable({
  providedIn: 'root'
})
export class LogSecurityService {

  private apiUrl = 'http://localhost:9000/portfolio-api/log-security'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private genericMethodeService: GenericMethodeService) { }

  getAllLogs(page: number, size: number): Observable<LogSecurityResponse> {
    const headers = this.genericMethodeService.getHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<LogSecurityResponse>(`${this.apiUrl}/all-log-security`, { headers, params });
  }

// log-security.service.ts
removeLogsByIds(ids: number[]): Observable<{ message: string }> {

  const headers = this.genericMethodeService.getHeaders();
  
  return this.http.delete<{ message: string }>(`${this.apiUrl}/remove-log-security-by-choose-id`, { headers, body: ids });
}
}