import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dashboard } from '../model/dashboard.model';
import { MissionControlService } from '../service/mission-control.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../service/web-socket.service';

@Component({
  selector: 'app-mission-control',
  templateUrl: './mission-control.component.html',
  styleUrls: ['./mission-control.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class MissionControlComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  data: Dashboard | null = null;

  // Pour l'action TLS
  tlsHostPort = '';

  // Nouvelles propriétés WebSocket
  wsConnected = false;
  lastUpdate = new Date();
  showAlert = false;
  currentAlert: any = null;

  private subscriptions = new Subscription();

  constructor(
    private api: MissionControlService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.setupWebSocket(); // ← N'OUBLIE PAS D'APPELER CETTE MÉTHODE !
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.wsService.disconnect();
  }

  private setupWebSocket(): void {
    // Connexion WebSocket
    this.wsService.connect();

    // Écouter le statut de connexion
    this.subscriptions.add(
      this.wsService.connected$.subscribe(connected => {
        this.wsConnected = connected;
        console.log('WebSocket status:', connected);
      })
    );

    // Écouter les updates du dashboard
    this.subscriptions.add(
      this.wsService.dashboardUpdates$.subscribe(update => {
        if (update && this.data) {
          // Fusionne les updates avec les données existantes
          this.data = { ...this.data, ...update };
          this.lastUpdate = new Date();
          
          // Petit effet visuel pour montrer l'update
          this.flashUpdateIndicator();
        }
      })
    );

    // Écouter les alertes
    this.subscriptions.add(
      this.wsService.alerts$.subscribe(alert => {
        if (alert) {
          this.currentAlert = alert;
          this.showAlert = true;
          
          // Auto-hide après 10 secondes pour les alertes non-critiques
          if (alert.level !== 'CRITICAL') {
            setTimeout(() => {
              this.showAlert = false;
            }, 10000);
          }
        }
      })
    );
  }

  private flashUpdateIndicator(): void {
    // Ajoute une classe CSS temporaire pour l'effet visuel
    const elements = document.querySelectorAll('.dashboard-card');
    elements.forEach(el => {
      el.classList.add('update-flash');
      setTimeout(() => el.classList.remove('update-flash'), 1000);
    });
  }

  // MÉTHODE MANQUANTE - AJOUTE ÇA !
  dismissAlert(): void {
    this.showAlert = false;
    this.currentAlert = null;
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.api.getDashboard().subscribe({
      next: (d) => { 
        this.data = d; 
        setTimeout(() => this.loading = false, 300);
      },
      error: (e) => { 
        this.error = e?.message ?? 'Erreur de chargement'; 
        this.loading = false; 
      }
    });
  }

  formatBytes(n?: number | null): string {
    if (n == null) return '-';
    const units = ['B','KB','MB','GB','TB','PB'];
    let idx = 0; let val = n;
    while (val >= 1024 && idx < units.length - 1) { val /= 1024; idx++; }
    return `${val.toFixed(1)} ${units[idx]}`;
  }

  uptime(): string {
    const ms = this.data?.availability?.uptimeMs ?? 0;
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  }

  badge(ok?: boolean | null): string {
    return ok ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40';
  }

  runBackup(): void {
    this.loading = true;
    this.api.runBackup().subscribe({
      next: () => this.refresh(),
      error: (e) => { this.error = e?.message ?? 'Backup failed'; this.loading = false; }
    });
  }

  checkTls(): void {
    if (!this.tlsHostPort?.trim()) return;
    this.loading = true;
    this.api.checkTls(this.tlsHostPort.trim()).subscribe({
      next: () => this.refresh(),
      error: (e) => { this.error = e?.message ?? 'TLS check failed'; this.loading = false; }
    });
  }

  get grafanaAppUrl(): string {
    const g = environment.grafana;
    
    // Construction correcte de l'URL
    const u = new URL(g.baseUrl);
    u.pathname = g.paths.application;
    
    // Paramètres de base Grafana
    u.searchParams.set('orgId', '1'); // Important: ajouter orgId
    u.searchParams.set('from', g.defaultRange);
    u.searchParams.set('to', g.defaultTo);
    
    // Variables du dashboard
    u.searchParams.set('var-namespace', g.vars.namespace);
    u.searchParams.set('var-pod', g.vars.pod);

    return u.toString();
  }

  get grafanaSystemUrl(): string {
    const g = environment.grafana;
    const u = new URL(g.baseUrl);
    u.pathname = g.paths.system;
    u.searchParams.set('orgId', '1');
    u.searchParams.set('from', g.defaultRange);
    u.searchParams.set('to', g.defaultTo);
    return u.toString();
  }

  get grafanaSecurityUrl(): string {
    const g = environment.grafana;
    const u = new URL(g.baseUrl);
    u.pathname = g.paths.security;
    u.searchParams.set('orgId', '1');
    u.searchParams.set('from', g.defaultRange);
    u.searchParams.set('to', g.defaultTo);
    return u.toString();
  }
}