import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GenericMethodeService } from '../../../services/generic-methode.service';

export interface TlsSecurityScan {
  id: number;
  target: string;
  scannedAt: string;
  certificateSubject: string;
  certificateIssuer: string;
  certificateNotBefore: string;
  certificateNotAfter: string;
  daysUntilExpiry: number;
  signatureAlgorithm: string;
  supportsTls10: boolean;
  supportsTls11: boolean;
  supportsTls12: boolean;
  supportsTls13: boolean;
  supportedCiphers: string;
  hasWeakCiphers: boolean;
  hasStrongCiphers: boolean;
  vulnerableToPoodle: boolean;
  vulnerableToBeast: boolean;
  vulnerableToHeartbleed: boolean;
  vulnerableToCrime: boolean;
  supportsHsts: boolean;
  supportsOcspStapling: boolean;
  supportsPfs: boolean;
  chainLength: number;
  chainTrusted: boolean;
  hasIntermediateCerts: boolean;
  securityGrade: string;
  securityScore: number;
  warnings: string;
  recommendations: string;
  passed: boolean;
}

export interface CrontabInfo {
  cronExpression: string;
  description: string;
  command: string;
  logFile: string;
  nextExecution: string;
  isActive: boolean;
  environment: string;
}

export interface TlsStatistics {
  totalScans: number;
  averageScore: number;
  lastScanDate: string;
  gradesDistribution: { [grade: string]: number };
  certificatesExpiringSoon: number;
}

@Injectable({ providedIn: 'root' })
export class TlsDashboardService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private genericMethodeService: GenericMethodeService
  ) {}

  /**
   * Récupère tous les scans TLS (10 derniers)
   */
  getAllScans(): Observable<TlsSecurityScan[]> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<TlsSecurityScan[]>(
      `${this.apiUrl}/security-status/advanced-scan/all`,
      { headers }
    );
  }

  /**
   * Récupère l'historique des scans pour un domaine
   */
  getScanHistory(target: string): Observable<TlsSecurityScan[]> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<TlsSecurityScan[]>(
      `${this.apiUrl}/security-status/advanced-scan/history?target=${target}`,
      { headers }
    );
  }

  /**
   * Récupère le dernier scan pour un domaine
   */
  getLatestScan(target: string): Observable<TlsSecurityScan> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<TlsSecurityScan>(
      `${this.apiUrl}/security-status/advanced-scan/latest?target=${target}`,
      { headers }
    );
  }

  /**
   * Récupère les informations crontab
   */
  getCrontabInfo(): Observable<CrontabInfo> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<CrontabInfo>(
      `${this.apiUrl}/security-status/crontab-info`,
      { headers }
    );
  }

  /**
   * Calcule les statistiques globales (côté client)
   */
  calculateStatistics(scans: TlsSecurityScan[]): TlsStatistics {
    if (!scans || scans.length === 0) {
      return {
        totalScans: 0,
        averageScore: 0,
        lastScanDate: 'N/A',
        gradesDistribution: {},
        certificatesExpiringSoon: 0
      };
    }

    const totalScans = scans.length;
    const averageScore = scans.reduce((sum, s) => sum + (s.securityScore || 0), 0) / totalScans;
    const lastScanDate = scans[0]?.scannedAt || 'N/A';

    // Distribution des grades
    const gradesDistribution: { [grade: string]: number } = {};
    scans.forEach(scan => {
      const grade = scan.securityGrade || 'Unknown';
      gradesDistribution[grade] = (gradesDistribution[grade] || 0) + 1;
    });

    // Certificats expirant dans moins de 30 jours
    const certificatesExpiringSoon = scans.filter(s => s.daysUntilExpiry && s.daysUntilExpiry < 30).length;

    return {
      totalScans,
      averageScore: Math.round(averageScore),
      lastScanDate,
      gradesDistribution,
      certificatesExpiringSoon
    };
  }
}
