import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dashboard } from '../model/dashboard.model';
import { MissionControlService, SystemHealthMetric, TLSHistory, SLAStats } from '../service/mission-control.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../service/web-socket.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexFill,
  ApexTheme
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-mission-control',
  templateUrl: './mission-control.component.html',
  styleUrls: ['./mission-control.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class MissionControlComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  data: Dashboard | null = null;

  // Timeline data
  systemTimeline: SystemHealthMetric[] = [];
  tlsHistory: TLSHistory[] = [];
  slaStats: SLAStats | null = null;

  // Table TLS
  tlsDataSource = new MatTableDataSource<TLSHistory>([]);
  tlsDisplayedColumns: string[] = ['target', 'checkedAt', 'daysLeft', 'ok', 'message'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Pour l'action TLS
  tlsHostPort = '';

  // WebSocket
  wsConnected = false;
  lastUpdate = new Date();
  showAlert = false;
  currentAlert: any = null;

  // Chart Options
  cpuChartOptions!: Partial<ChartOptions>;
  ramChartOptions!: Partial<ChartOptions>;
  diskChartOptions!: Partial<ChartOptions>;

  // Sparkline options (mini-charts dans les cards)
  cpuSparklineOptions: any;
  ramSparklineOptions: any;
  diskSparklineOptions: any;

  private subscriptions = new Subscription();

  constructor(
    private api: MissionControlService,
    private wsService: WebSocketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.loadTimeline();
    this.loadTLSHistory();
    this.loadSLAStats();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.wsService.disconnect();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.tlsDataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.tlsDataSource.sort = this.sort;
    }
  }

  private setupWebSocket(): void {
    this.wsService.connect();

    this.subscriptions.add(
      this.wsService.connected$.subscribe(connected => {
        this.wsConnected = connected;
      })
    );

    this.subscriptions.add(
      this.wsService.dashboardUpdates$.subscribe(update => {
        if (update && this.data) {
          this.data = { ...this.data, ...update };
          this.lastUpdate = new Date();
          this.flashUpdateIndicator();
        }
      })
    );

    this.subscriptions.add(
      this.wsService.alerts$.subscribe(alert => {
        if (alert) {
          this.currentAlert = alert;
          this.showAlert = true;

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
    const elements = document.querySelectorAll('.dashboard-card');
    elements.forEach(el => {
      el.classList.add('update-flash');
      setTimeout(() => el.classList.remove('update-flash'), 1000);
    });
  }

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

  // ========== NOUVELLES MÉTHODES PHASE 1 ==========

  loadTimeline(): void {
    this.api.getSystemHealthTimeline(24).subscribe({
      next: (timeline) => {
        this.systemTimeline = timeline;
        this.initCharts();
        this.initSparklines();
      },
      error: (err) => {
        // console.error('❌ Erreur chargement timeline:', err);
      }
    });
  }

  loadTLSHistory(): void {
    this.api.getSecurityHistory().subscribe({
      next: (history) => {
        this.tlsHistory = history;
        this.tlsDataSource.data = history;
      },
      error: (err) => {
        // console.error('❌ Erreur chargement TLS history:', err);
      }
    });
  }

  loadSLAStats(): void {
    this.api.getSLAStats(30).subscribe({
      next: (stats) => {
        this.slaStats = stats;
      },
      error: (err) => {
        // console.error('❌ Erreur chargement SLA stats:', err);
      }
    });
  }

  purgeLogs(): void {
    if (!confirm('⚠️ Supprimer tous les logs/backups de plus de 30 jours ?\n\nCette action est IRRÉVERSIBLE !')) {
      return;
    }

    this.api.purgeLogs(30).subscribe({
      next: (response) => {
        this.showSnackBar(`✅ ${response.message}`, 'success');
      },
      error: (err) => {
        // console.error('❌ Erreur purge logs:', err);
        this.showSnackBar('❌ Erreur lors de la purge', 'error');
      }
    });
  }

  purgeSnapshots(): void {
    if (!confirm('⚠️ Supprimer tous les snapshots système de plus de 7 jours ?')) {
      return;
    }

    this.api.purgeSystemSnapshots(7).subscribe({
      next: (response) => {
        this.showSnackBar(`✅ ${response.message}`, 'success');
        this.loadTimeline(); // Refresh
      },
      error: (err) => {
        // console.error('❌ Erreur purge snapshots:', err);
        this.showSnackBar('❌ Erreur lors de la purge', 'error');
      }
    });
  }

  // ========== CHARTS ==========

  private initCharts(): void {
    if (this.systemTimeline.length === 0) return;

    const categories = this.systemTimeline.map((_, i) => i.toString());

    // CPU Chart
    const cpuData = this.systemTimeline.map(m =>
      m.systemCpuLoad !== null ? (m.systemCpuLoad * 100) : 0
    );

    this.cpuChartOptions = {
      series: [{ name: 'CPU %', data: cpuData }],
      chart: { type: 'area', height: 300, background: 'transparent', toolbar: { show: false } },
      colors: ['#00d4ff'],
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
      dataLabels: { enabled: false },
      xaxis: { categories, labels: { show: false } },
      yaxis: { min: 0, max: 100, labels: { style: { colors: ['#94a3b8'] } } },
      grid: { borderColor: '#334155', strokeDashArray: 4 },
      tooltip: { theme: 'dark' },
      theme: { mode: 'dark' }
    };

    // RAM Chart
    const ramData = this.systemTimeline.map(m => {
      const used = m.heapUsedBytes || 0;
      const max = m.heapMaxBytes || 1;
      return ((used / max) * 100);
    });

    this.ramChartOptions = {
      series: [{ name: 'RAM %', data: ramData }],
      chart: { type: 'area', height: 300, background: 'transparent', toolbar: { show: false } },
      colors: ['#8b5cf6'],
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
      dataLabels: { enabled: false },
      xaxis: { categories, labels: { show: false } },
      yaxis: { min: 0, max: 100, labels: { style: { colors: ['#94a3b8'] } } },
      grid: { borderColor: '#334155', strokeDashArray: 4 },
      tooltip: { theme: 'dark' },
      theme: { mode: 'dark' }
    };

    // Disk Chart
    const diskData = this.systemTimeline.map(m => {
      const used = (m.totalDiskBytes || 0) - (m.freeDiskBytes || 0);
      const total = m.totalDiskBytes || 1;
      return ((used / total) * 100);
    });

    this.diskChartOptions = {
      series: [{ name: 'Disk %', data: diskData }],
      chart: { type: 'area', height: 300, background: 'transparent', toolbar: { show: false } },
      colors: ['#ec4899'],
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
      dataLabels: { enabled: false },
      xaxis: { categories, labels: { show: false } },
      yaxis: { min: 0, max: 100, labels: { style: { colors: ['#94a3b8'] } } },
      grid: { borderColor: '#334155', strokeDashArray: 4 },
      tooltip: { theme: 'dark' },
      theme: { mode: 'dark' }
    };
  }

  private initSparklines(): void {
    if (this.systemTimeline.length === 0) return;

    const cpuData = this.systemTimeline.slice(-10).map(m =>
      m.systemCpuLoad !== null ? (m.systemCpuLoad * 100) : 0
    );
    const ramData = this.systemTimeline.slice(-10).map(m => {
      const used = m.heapUsedBytes || 0;
      const max = m.heapMaxBytes || 1;
      return ((used / max) * 100);
    });
    const diskData = this.systemTimeline.slice(-10).map(m => {
      const used = (m.totalDiskBytes || 0) - (m.freeDiskBytes || 0);
      const total = m.totalDiskBytes || 1;
      return ((used / total) * 100);
    });

    const baseSparkline = {
      chart: { type: 'line', height: 50, sparkline: { enabled: true }, background: 'transparent' },
      stroke: { curve: 'smooth', width: 2 },
      tooltip: { enabled: false },
      theme: { mode: 'dark' }
    };

    this.cpuSparklineOptions = { ...baseSparkline, series: [{ data: cpuData }], colors: ['#00d4ff'] };
    this.ramSparklineOptions = { ...baseSparkline, series: [{ data: ramData }], colors: ['#8b5cf6'] };
    this.diskSparklineOptions = { ...baseSparkline, series: [{ data: diskData }], colors: ['#ec4899'] };
  }

  // ========== HELPERS ==========

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

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  badge(ok?: boolean | null): string {
    return ok ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40';
  }

  runBackup(): void {
    this.loading = true;
    this.api.runBackup().subscribe({
      next: () => {
        this.refresh();
        this.showSnackBar('✅ Backup lancé avec succès', 'success');
      },
      error: (e) => {
        this.error = e?.message ?? 'Backup failed';
        this.loading = false;
        this.showSnackBar('❌ Erreur backup', 'error');
      }
    });
  }

  checkTls(): void {
    if (!this.tlsHostPort?.trim()) return;
    this.loading = true;
    this.api.checkTls(this.tlsHostPort.trim()).subscribe({
      next: () => {
        this.refresh();
        this.loadTLSHistory();
        this.showSnackBar('✅ Check TLS effectué', 'success');
      },
      error: (e) => {
        this.error = e?.message ?? 'TLS check failed';
        this.loading = false;
        this.showSnackBar('❌ Erreur TLS check', 'error');
      }
    });
  }

  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  get grafanaAppUrl(): string {
    const g = environment.grafana;
    const u = new URL(g.baseUrl);
    u.pathname = g.paths.application;
    u.searchParams.set('orgId', '1');
    u.searchParams.set('from', g.defaultRange);
    u.searchParams.set('to', g.defaultTo);
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
