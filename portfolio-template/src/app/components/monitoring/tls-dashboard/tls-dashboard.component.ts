import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexStroke } from 'ng-apexcharts';
import { TlsDashboardService, TlsSecurityScan, CrontabInfo, TlsStatistics } from '../service/tls-dashboard.service';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
};

@Component({
  selector: 'app-tls-dashboard',
  templateUrl: './tls-dashboard.component.html',
  styleUrls: ['./tls-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    NgApexchartsModule
  ]
})
export class TlsDashboardComponent implements OnInit {
  loading = false;
  scans: TlsSecurityScan[] = [];
  statistics: TlsStatistics | null = null;
  crontabInfo: CrontabInfo | null = null;

  // Table
  dataSource = new MatTableDataSource<TlsSecurityScan>([]);
  displayedColumns: string[] = ['target', 'scannedAt', 'grade', 'score', 'daysUntilExpiry', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filters
  filterTarget = '';

  // Selected scan pour le modal détail
  selectedScan: TlsSecurityScan | null = null;
  showDetailModal = false;

  // Chart
  chartOptions!: Partial<ChartOptions>;

  constructor(
    private tlsService: TlsDashboardService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadScans();
    this.loadCrontabInfo();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadScans(): void {
    this.loading = true;
    this.tlsService.getAllScans().subscribe({
      next: (scans) => {
        this.scans = scans;
        this.dataSource.data = scans;
        this.statistics = this.tlsService.calculateStatistics(scans);
        this.initChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement scans TLS:', err);
        this.loading = false;
        this.showSnackBar('❌ Erreur chargement des scans', 'error');
      }
    });
  }

  loadCrontabInfo(): void {
    this.tlsService.getCrontabInfo().subscribe({
      next: (info) => {
        this.crontabInfo = info;
      },
      error: (err) => {
        console.error('❌ Erreur chargement crontab:', err);
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.filterTarget.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  viewDetails(scan: TlsSecurityScan): void {
    this.selectedScan = scan;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedScan = null;
  }

  exportToCSV(): void {
    const headers = ['Target', 'Scan Date', 'Grade', 'Score', 'Days Until Expiry', 'TLS 1.2', 'TLS 1.3'];
    const rows = this.scans.map(s => [
      s.target,
      new Date(s.scannedAt).toLocaleString(),
      s.securityGrade,
      s.securityScore,
      s.daysUntilExpiry,
      s.supportsTls12 ? 'Yes' : 'No',
      s.supportsTls13 ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tls-scans-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.showSnackBar('✅ Export CSV réussi', 'success');
  }

  getGradeBadgeClass(grade: string): string {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50';
      case 'B':
        return 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/50';
      case 'C':
        return 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50';
      case 'D':
        return 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/50';
      case 'F':
        return 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/50';
    }
  }

  getDaysClass(days: number): string {
    if (days > 60) return 'text-emerald-400';
    if (days > 30) return 'text-amber-400';
    return 'text-rose-400';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  goBackToMissionControl(): void {
    this.router.navigate(['/mission-control']);
  }

  private initChart(): void {
    if (this.scans.length === 0) return;

    const categories = this.scans.slice(0, 10).reverse().map((_, i) => `Scan ${i + 1}`);
    const scores = this.scans.slice(0, 10).reverse().map(s => s.securityScore || 0);

    this.chartOptions = {
      series: [{ name: 'Security Score', data: scores }],
      chart: {
        type: 'line',
        height: 250,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false } // Disable animations to reduce warnings
      },
      colors: ['#10b981'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        labels: {
          style: { colors: ['#94a3b8'] }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          style: { colors: ['#94a3b8'] }
        }
      }
    };
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
