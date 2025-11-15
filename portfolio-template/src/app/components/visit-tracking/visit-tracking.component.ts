import { Component, OnInit, ViewChild } from '@angular/core';
import { VisitTrackingService, VisitDTO, VisitStatsDTO } from '../../services/visit-tracking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-visit-tracking',
  templateUrl: './visit-tracking.component.html',
  styleUrls: ['./visit-tracking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class VisitTrackingComponent implements OnInit {

  // ✅ Plus jamais null → le template ne crie plus
  stats: VisitStatsDTO = {
    totalVisits: 0,
    averageSessionDuration: 0,
    visitsByCountry: [],
    visitsByPage: [],
    visitsByDevice: [],
    visitsByBrowser: [],
    topReferrers: [],
    recentVisits: []
  };

  allVisits: VisitDTO[] = [];
  filteredVisits: VisitDTO[] = [];
  dataSource = new MatTableDataSource<VisitDTO>([]);

  // Pagination & Tri
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Colonnes affichées
  displayedColumns: string[] = ['select', 'idVisit', 'visitDate', 'pageUrl', 'country', 'deviceType', 'browser', 'sessionDuration', 'actions'];

  // Sélection multiple
  selection = new SelectionModel<VisitDTO>(true, []);

  isLoading = true;

  // ✅ On garde ton API string pour les onglets
  selectedTab: 'overview' | 'visits' | 'analytics' = 'overview';

  // Filtres basiques
  filterCountry = '';
  filterDevice  = '';
  filterPage    = '';

  // Filtres temporels
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private visitService: VisitTrackingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadAllVisits();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // --- Data loading ---
  loadStats(): void {
    this.isLoading = true;
    this.visitService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats ?? this.stats;
        this.isLoading = false;
      },
      error: (err) => {
        // console.error('❌ Erreur chargement stats:', err);
        this.isLoading = false;
        this.showSnackBar('Erreur de chargement des stats', 'error');
      }
    });
  }

  loadAllVisits(): void {
    this.visitService.getAllVisits().subscribe({
      next: (visits) => {
        this.allVisits = visits ?? [];
        this.applyFilters();
      },
      error: (err) => {
        // console.error('❌ Erreur chargement visites:', err);
        this.showSnackBar('Erreur de chargement des visites', 'error');
      }
    });
  }

  // --- Tabs ---
  // ✅ On synchronise ton string avec l'index Angular Material
  onTabChange(index: number): void {
    this.selectedTab = (['overview', 'visits', 'analytics'] as const)[index];
  }

  selectTab(tab: 'overview' | 'visits' | 'analytics'): void {
    this.selectedTab = tab;
  }

  // --- Filtres ---
  applyFilters(): void {
    this.filteredVisits = this.allVisits.filter(visit => {
      const matchCountry = !this.filterCountry || visit.country?.toLowerCase().includes(this.filterCountry.toLowerCase());
      const matchDevice  = !this.filterDevice  || visit.deviceType?.toLowerCase().includes(this.filterDevice.toLowerCase());
      const matchPage    = !this.filterPage    || visit.pageUrl?.toLowerCase().includes(this.filterPage.toLowerCase());

      // Filtre temporel
      const visitDate = new Date(visit.visitDate);
      const matchStartDate = !this.startDate || visitDate >= this.startDate;
      const matchEndDate = !this.endDate || visitDate <= this.endDate;

      return matchCountry && matchDevice && matchPage && matchStartDate && matchEndDate;
    });

    this.dataSource.data = this.filteredVisits;
    this.selection.clear();
  }

  resetFilters(): void {
    this.filterCountry = '';
    this.filterDevice  = '';
    this.filterPage    = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  // Filtres rapides
  filterToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.startDate = today;
    this.endDate = new Date();
    this.applyFilters();
  }

  filterLast7Days(): void {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.startDate = sevenDaysAgo;
    this.endDate = today;
    this.applyFilters();
  }

  filterLast30Days(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.startDate = thirtyDaysAgo;
    this.endDate = today;
    this.applyFilters();
  }

  // --- Sélection multiple ---
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  // --- Suppressions ---
  deleteVisit(visit: VisitDTO): void {
    if (!confirm(`Supprimer la visite #${visit.idVisit} ?`)) return;

    this.visitService.deleteVisit(visit.idVisit).subscribe({
      next: () => {
        this.showSnackBar(`Visite #${visit.idVisit} supprimée`, 'success');
        this.loadAllVisits();
        this.loadStats();
      },
      error: (err) => {
        // console.error('❌ Erreur suppression:', err);
        this.showSnackBar('Erreur lors de la suppression', 'error');
      }
    });
  }

  deleteSelectedVisits(): void {
    const selectedIds = this.selection.selected.map(v => v.idVisit);
    if (selectedIds.length === 0) {
      this.showSnackBar('Aucune visite sélectionnée', 'warning');
      return;
    }

    if (!confirm(`Supprimer ${selectedIds.length} visite(s) sélectionnée(s) ?`)) return;

    this.visitService.deleteVisitsInBatch(selectedIds).subscribe({
      next: () => {
        this.showSnackBar(`${selectedIds.length} visite(s) supprimée(s)`, 'success');
        this.selection.clear();
        this.loadAllVisits();
        this.loadStats();
      },
      error: (err) => {
        // console.error('❌ Erreur suppression batch:', err);
        this.showSnackBar('Erreur lors de la suppression en masse', 'error');
      }
    });
  }

  purgeOldVisits(days: number): void {
    if (!confirm(`⚠️ Supprimer toutes les visites de plus de ${days} jours ?\n\nCette action est IRRÉVERSIBLE !`)) return;

    this.visitService.deleteVisitsOlderThan(days).subscribe({
      next: (response) => {
        this.showSnackBar(response.message, 'success');
        this.loadAllVisits();
        this.loadStats();
      },
      error: (err) => {
        // console.error('❌ Erreur purge:', err);
        this.showSnackBar('Erreur lors de la purge', 'error');
      }
    });
  }

  // --- Helpers d’affichage ---
  formatDuration(seconds: number): string {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  exportToCSV(): void {
    const headers = ['Date', 'Page', 'Pays', 'Device', 'Browser', 'OS', 'Durée', 'Referrer'];
    const rows = this.filteredVisits.map(v => [
      this.formatDate(v.visitDate),
      v.pageUrl,
      v.country || 'N/A',
      v.deviceType || 'N/A',
      v.browser || 'N/A',
      v.operatingSystem || 'N/A',
      this.formatDuration(v.sessionDuration),
      v.referrer || 'direct'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-visits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // --- Getters KPIs ---
  get totalVisits(): number {
    return this.stats.totalVisits || 0;
  }

  get avgSessionDuration(): string {
    const avg = this.stats.averageSessionDuration || 0;
    return this.formatDuration(Math.floor(avg));
  }

  get topCountry(): string {
    return this.stats.visitsByCountry[0]?.country || 'N/A';
  }

  get topDevice(): string {
    return this.stats.visitsByDevice[0]?.device || 'N/A';
  }

  get recentVisitsCount(): number {
    return this.stats.recentVisits.length || 0;
  }

  // --- Snackbar helper ---
  showSnackBar(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
