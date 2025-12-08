import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

// Services & Models
import { CandidacyService } from '../../services/candidacy.service';
import { Candidacy, CandidacyStatus } from '../../models/candidacy.model';

// Modals
import { CandidacyDetailsModalComponent } from '../candidacy-details-modal/candidacy-details-modal.component';
import { EditCandidacyModalComponent } from '../edit-candidacy-modal/edit-candidacy-modal.component';

@Component({
  selector: 'app-candidacies-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './candidacies-list.component.html',
  styleUrls: ['./candidacies-list.component.scss']
})
export class CandidaciesListComponent implements OnInit {
  // Data
  candidacies: Candidacy[] = [];
  filteredCandidacies: Candidacy[] = [];
  displayedCandidacies: Candidacy[] = [];

  // Pagination
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  // Loading
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus: string = 'ALL';
  statusOptions = ['ALL', ...Object.values(CandidacyStatus)];

  // Table columns
  displayedColumns: string[] = [
    'company',
    'jobOffer',
    'applicationDate',
    'status',
    'channel',
    'interest',
    'actions'
  ];

  constructor(
    private candidacyService: CandidacyService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCandidacies();
  }

  // Load candidacies from backend
  loadCandidacies(): void {
    this.isLoading = true;
    // Load all candidacies (we'll handle filtering on frontend)
    this.candidacyService.getAllCandidacies(1, 1000).subscribe({
      next: (response) => {
        this.candidacies = response.data;
        this.totalItems = response.total;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidacies:', error);
        this.isLoading = false;
        this.showError('Erreur lors du chargement des candidatures');
      }
    });
  }

  // Apply filters and search
  applyFilters(): void {
    let filtered = [...this.candidacies];

    // Filter by status
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(c => c.currentStatus === this.selectedStatus);
    }

    // Filter by search term (company name or job title)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => {
        const companyName = c.company?.name?.toLowerCase() || '';
        const jobTitle = c.jobOffer?.title?.toLowerCase() || '';
        return companyName.includes(term) || jobTitle.includes(term);
      });
    }

    this.filteredCandidacies = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedCandidacies();
  }

  // Update displayed candidacies based on pagination
  updateDisplayedCandidacies(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedCandidacies = this.filteredCandidacies.slice(startIndex, endIndex);
  }

  // Handle page change
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updateDisplayedCandidacies();
  }

  // Handle search
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Handle status filter change
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Clear filters
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Navigation
  navigateToScraping(): void {
    this.router.navigate(['/job-track-scraping']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/job-track-dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/job-track-template']);
  }

  // View candidacy details
  viewDetails(candidacy: Candidacy): void {
    const dialogRef = this.dialog.open(CandidacyDetailsModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { candidacy },
      panelClass: 'custom-dialog-container'
    });
  }

  // Edit candidacy
  editCandidacy(candidacy: Candidacy): void {
    const dialogRef = this.dialog.open(EditCandidacyModalComponent, {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { candidacy },
      panelClass: 'custom-dialog-container'
    });

    // Reload data after successful edit
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCandidacies();
        this.showSuccess('Candidature mise à jour avec succès');
      }
    });
  }

  // Delete candidacy
  deleteCandidacy(candidacy: Candidacy): void {
    if (!candidacy.id) return;

    const confirmDelete = confirm(
      `Êtes-vous sûr de vouloir supprimer la candidature chez ${candidacy.company?.name || 'cette entreprise'} ?`
    );

    if (confirmDelete) {
      this.candidacyService.deleteCandidacy(candidacy.id).subscribe({
        next: () => {
          this.showSuccess('Candidature supprimée avec succès');
          this.loadCandidacies();
        },
        error: (error) => {
          console.error('Error deleting candidacy:', error);
          this.showError('Erreur lors de la suppression de la candidature');
        }
      });
    }
  }

  // Utility methods
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'SENT': 'Envoyée',
      'UNDER_REVIEW': 'En cours de révision',
      'PHONE_SCREENING': 'Entretien téléphonique',
      'INTERVIEW_SCHEDULED': 'Entretien programmé',
      'INTERVIEW_COMPLETED': 'Entretien effectué',
      'OFFER_RECEIVED': 'Offre reçue',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Rejetée',
      'WITHDRAWN': 'Retirée'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'SENT': '#6366f1',
      'UNDER_REVIEW': '#8b5cf6',
      'PHONE_SCREENING': '#3b82f6',
      'INTERVIEW_SCHEDULED': '#10b981',
      'INTERVIEW_COMPLETED': '#14b8a6',
      'OFFER_RECEIVED': '#22c55e',
      'ACCEPTED': '#16a34a',
      'REJECTED': '#ef4444',
      'WITHDRAWN': '#9ca3af'
    };
    return statusColors[status] || '#9ca3af';
  }

  getInterestStars(level?: number): string {
    if (!level) return '';
    return '⭐'.repeat(level);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Notifications
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  // Refresh data
  refresh(): void {
    this.loadCandidacies();
    this.showSuccess('Liste actualisée');
  }
}
