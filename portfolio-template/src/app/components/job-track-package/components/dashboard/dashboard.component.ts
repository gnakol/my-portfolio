import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services & Models
import { StatisticsService } from '../../services/statistics.service';
import {
  StatisticsOverview,
  StackStatistics,
  LocationStatistics,
  StackPerformance,
  LocationPerformance
} from '../../models/statistics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Loading states
  isLoadingOverview = false;
  isLoadingStack = false;
  isLoadingLocation = false;

  // Data
  overview: StatisticsOverview | null = null;
  stackStats: StackStatistics | null = null;
  locationStats: LocationStatistics | null = null;

  // Computed data for display
  topStacks: StackPerformance[] = [];
  topLocations: LocationPerformance[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllStatistics();
  }

  // Load all statistics
  loadAllStatistics(): void {
    this.loadOverview();
    this.loadStackStatistics();
    this.loadLocationStatistics();
  }

  // Load overview statistics
  loadOverview(): void {
    this.isLoadingOverview = true;
    this.statisticsService.getOverview().subscribe({
      next: (data) => {
        this.overview = data;
        this.isLoadingOverview = false;
      },
      error: (error) => {
        console.error('Error loading overview statistics:', error);
        this.isLoadingOverview = false;
        this.showError('Erreur lors du chargement des statistiques globales');
      }
    });
  }

  // Load stack statistics
  loadStackStatistics(): void {
    this.isLoadingStack = true;
    this.statisticsService.getByStack().subscribe({
      next: (data) => {
        this.stackStats = data;
        // Get top 3 stacks by success rate
        this.topStacks = [...data.stacks]
          .sort((a, b) => b.successRate - a.successRate)
          .slice(0, 3);
        this.isLoadingStack = false;
      },
      error: (error) => {
        console.error('Error loading stack statistics:', error);
        this.isLoadingStack = false;
        this.showError('Erreur lors du chargement des statistiques par stack');
      }
    });
  }

  // Load location statistics
  loadLocationStatistics(): void {
    this.isLoadingLocation = true;
    this.statisticsService.getByLocation().subscribe({
      next: (data) => {
        this.locationStats = data;
        // Get top 3 locations by response rate
        this.topLocations = [...data.locations]
          .sort((a, b) => b.responseRate - a.responseRate)
          .slice(0, 3);
        this.isLoadingLocation = false;
      },
      error: (error) => {
        console.error('Error loading location statistics:', error);
        this.isLoadingLocation = false;
        this.showError('Erreur lors du chargement des statistiques par localisation');
      }
    });
  }

  // Navigation helpers
  navigateToScraping(): void {
    this.router.navigate(['/job-track-scraping']);
  }

  navigateToCandidacies(): void {
    this.router.navigate(['/job-track-candidacies']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/job-track-statistics']);
  }

  goBack(): void {
    this.router.navigate(['/job-track-template']);
  }

  // Utility methods
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'APPLIED': '#6366f1',
      'PHONE_SCREEN': '#8b5cf6',
      'INTERVIEW': '#3b82f6',
      'TECHNICAL_TEST': '#10b981',
      'OFFER_RECEIVED': '#22c55e',
      'ACCEPTED': '#16a34a',
      'REJECTED': '#ef4444',
      'WITHDRAWN': '#9ca3af',
      'NO_RESPONSE': '#6b7280'
    };
    return statusColors[status] || '#9ca3af';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'APPLIED': 'Envoyée',
      'PHONE_SCREEN': 'Entretien téléphonique',
      'INTERVIEW': 'Entretien',
      'TECHNICAL_TEST': 'Test technique',
      'OFFER_RECEIVED': 'Offre reçue',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Rejetée',
      'WITHDRAWN': 'Retirée',
      'NO_RESPONSE': 'Pas de réponse'
    };
    return statusLabels[status] || status;
  }

  getRateColor(rate: number): string {
    if (rate >= 70) return '#22c55e'; // Green
    if (rate >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }

  // Error handling
  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  // Refresh data
  refresh(): void {
    this.loadAllStatistics();
    this.snackBar.open('Statistiques actualisées', 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
