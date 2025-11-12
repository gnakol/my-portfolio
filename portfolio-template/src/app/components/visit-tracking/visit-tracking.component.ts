import { Component, OnInit } from '@angular/core';
import { VisitTrackingService, VisitDTO, VisitStatsDTO } from '../../services/visit-tracking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-visit-tracking',
  templateUrl: './visit-tracking.component.html',
  styleUrls: ['./visit-tracking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule
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

  isLoading = true;

  // ✅ On garde ton API string pour les onglets
  selectedTab: 'overview' | 'visits' | 'analytics' = 'overview';

  // Filtres
  filterCountry = '';
  filterDevice  = '';
  filterPage    = '';

  constructor(private visitService: VisitTrackingService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadAllVisits();
  }

  // --- Data loading ---
  loadStats(): void {
    this.isLoading = true;
    this.visitService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats ?? this.stats; // fallback par sécurité
        this.isLoading = false;
        console.log('✅ Stats chargées:', stats);
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllVisits(): void {
    this.visitService.getAllVisits().subscribe({
      next: (visits) => {
        this.allVisits = visits ?? [];
        this.filteredVisits = this.allVisits;
        console.log('✅ Visites chargées:', this.allVisits.length);
      },
      error: (err) => console.error('❌ Erreur chargement visites:', err)
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
      return matchCountry && matchDevice && matchPage;
    });
  }

  resetFilters(): void {
    this.filterCountry = '';
    this.filterDevice  = '';
    this.filterPage    = '';
    this.filteredVisits = this.allVisits;
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
}
