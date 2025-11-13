import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface VisitDTO {
  idVisit: number;
  visitDate: string;
  userAgent: string;
  referrer: string;
  country: string;
  pageUrl: string;
  sessionDuration: number;
  ipHash: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
}

export interface CreateVisitRequest {
  pageUrl: string;
  referrer: string;
  sessionDuration?: number;
}

export interface VisitStatsDTO {
  totalVisits: number;
  averageSessionDuration: number;
  visitsByCountry: Array<{ country: string; count: number }>;
  visitsByPage: Array<{ page: string; count: number }>;
  visitsByDevice: Array<{ device: string; count: number }>;
  visitsByBrowser: Array<{ browser: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  recentVisits: VisitDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class VisitTrackingService {

  private visitsUrl = `${environment.apiBaseUrl}/visits`;

  private currentVisitId: number | null = null;
  private sessionStartTime: number = Date.now();
  private heartbeatSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initTracking();
  }

  /**
   * Initialise le tracking automatique
   */
  private initTracking(): void {
    // Track la première page au chargement
    this.trackPageView(window.location.href, document.referrer);

    // Track les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackPageView(event.urlAfterRedirects, document.referrer);
    });

    // Démarre le heartbeat
    this.startHeartbeat();
  }

  /**
   * Enregistre une page view
   */
  private trackPageView(pageUrl: string, referrer: string): void {
    const request: CreateVisitRequest = {
      pageUrl,
      referrer: referrer || 'direct',
      sessionDuration: 0
    };

    this.createVisit(request).subscribe({
      next: (visit) => {
        this.currentVisitId = visit.idVisit;
        this.sessionStartTime = Date.now();
        // console.log('✅ Visite trackée:', visit.idVisit, pageUrl);
      },
      // error: (err) => console.error('❌ Erreur tracking visite:', err)
    });
  }

  /**
   * Démarre le heartbeat (toutes les 30 secondes)
   */
  private startHeartbeat(): void {
    this.heartbeatSubscription = interval(30000).subscribe(() => {
      if (this.currentVisitId) {
        const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        this.updateSessionDuration(this.currentVisitId, duration).subscribe({
          // next: () => console.log(`⏱️ Session duration: ${duration}s`),
          // error: (err) => console.error('❌ Erreur heartbeat:', err)
        });
      }
    });
  }

  /**
   * API CALLS
   */

  /**
   * Crée une nouvelle visite
   */
  createVisit(request: CreateVisitRequest): Observable<VisitDTO> {
    return this.http.post<VisitDTO>(this.visitsUrl, request);
  }

  /**
   * Met à jour la durée de session
   */
  updateSessionDuration(visitId: number, sessionDuration: number): Observable<VisitDTO> {
    return this.http.put<VisitDTO>(
      `${this.visitsUrl}/${visitId}/duration?sessionDuration=${sessionDuration}`,
      null
    );
  }

  /**
   * Récupère les statistiques (ADMIN)
   */
  getStats(): Observable<VisitStatsDTO> {
    return this.http.get<VisitStatsDTO>(`${this.visitsUrl}/stats`);
  }

  /**
   * Récupère toutes les visites (ADMIN)
   */
  getAllVisits(): Observable<VisitDTO[]> {
    return this.http.get<VisitDTO[]>(this.visitsUrl);
  }

  // ========== NOUVELLES MÉTHODES DE GESTION ==========

  /**
   * Supprime une visite par son ID (ADMIN)
   */
  deleteVisit(visitId: number): Observable<void> {
    return this.http.delete<void>(`${this.visitsUrl}/${visitId}`);
  }

  /**
   * Supprime plusieurs visites en batch (ADMIN)
   */
  deleteVisitsInBatch(visitIds: number[]): Observable<void> {
    return this.http.delete<void>(`${this.visitsUrl}/batch`, {
      body: { ids: visitIds }
    });
  }

  /**
   * Supprime toutes les visites antérieures à X jours (ADMIN)
   */
  deleteVisitsOlderThan(days: number): Observable<{ deletedCount: number; message: string }> {
    return this.http.delete<{ deletedCount: number; message: string }>(
      `${this.visitsUrl}/older-than/${days}`
    );
  }

  /**
   * Récupère l'évolution temporelle des visites (ADMIN)
   */
  getVisitsTimeline(): Observable<Array<{ date: string; count: number }>> {
    return this.http.get<Array<{ date: string; count: number }>>(`${this.visitsUrl}/stats/timeline`);
  }

  /**
   * Nettoie le service
   */
  ngOnDestroy(): void {
    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
    }
  }
}
