import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Dashboard } from '../model/dashboard.model';
import { environment } from '../../../../environments/environment';
import { GenericMethodeService } from '../../../services/generic-methode.service';

export interface SystemHealthMetric {
  systemCpuLoad: number | null;
  heapUsedBytes: number;
  heapMaxBytes: number;
  totalDiskBytes: number;
  freeDiskBytes: number;
}

export interface TLSHistory {
  kind: string;
  target: string;
  checkedAt: string;
  daysLeft: number | null;
  ok: boolean;
  message: string;
}

export interface SLAStats {
  uptimePercent: number;
  totalChecks: number;
  okChecks: number;
  totalErrors5xx: number;
}

export interface K8sMetrics {
  podsCount: number;
  totalRamBytes: number;
  totalRamMB: number;
  totalRamGB: string;
}

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

  // ========== NOUVEAUX ENDPOINTS PHASE 1 ==========

  /**
   * Récupère la timeline des métriques système (X dernières heures)
   */
  getSystemHealthTimeline(hours: number = 24): Observable<SystemHealthMetric[]> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<SystemHealthMetric[]>(
      `${this.apiUrl}/system-health/timeline?hours=${hours}`,
      { headers }
    );
  }

  /**
   * Récupère l'historique des checks TLS
   */
  getSecurityHistory(): Observable<TLSHistory[]> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<TLSHistory[]>(
      `${this.apiUrl}/security-status/history`,
      { headers }
    );
  }

  /**
   * Purge les logs/backups anciens
   */
  purgeLogs(days: number): Observable<{ deletedCount: number; message: string }> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete<{ deletedCount: number; message: string }>(
      `${this.apiUrl}/maintenance/logs/older-than/${days}`,
      { headers }
    );
  }

  /**
   * Purge les snapshots système anciens
   */
  purgeSystemSnapshots(days: number): Observable<{ deletedCount: number; message: string }> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete<{ deletedCount: number; message: string }>(
      `${this.apiUrl}/system-health/snapshots/older-than/${days}`,
      { headers }
    );
  }

  /**
   * Récupère les stats SLA (uptime %)
   */
  getSLAStats(days: number = 30): Observable<SLAStats> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<SLAStats>(
      `${this.apiUrl}/availability/sla?days=${days}`,
      { headers }
    );
  }

  /**
   * Récupère les métriques Kubernetes depuis Prometheus
   */
  getK8sMetrics(): Observable<K8sMetrics> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<K8sMetrics>(
      `${this.apiUrl}/system-health/k8s-metrics`,
      { headers }
    );
  }
}
