import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Dashboard } from '../model/dashboard.model';
import { environment } from '../../../../environments/environment';
import { GenericMethodeService } from '../../../services/generic-methode.service';

@Injectable({ providedIn: 'root' })
export class MissionControlService {
  private readonly api = '/portfolio-api';
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private genericMethodeService : GenericMethodeService
  ) {}

  getDashboard(): Observable<Dashboard> {
    const headers = this.genericMethodeService.getHeaders(); 
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard/status`, {headers});
  }

  runBackup(): Observable<any> {
    return this.http.post(`${this.api}/maintenance/backup/run`, {}, { responseType: 'json' });
  }

  checkTls(hostPort: string): Observable<any> {
    const params = new HttpParams().set('hostPort', hostPort);
    return this.http.post(`${this.api}/security-status/check-tls`, null, { params });
  }
}
