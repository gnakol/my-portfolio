import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

// Models & Services
import { JobOffer } from '../../models/job-offer.model';
import { JobOfferService } from '../../services/job-offer.service';

@Component({
  selector: 'app-job-offers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './job-offers-list.component.html',
  styleUrls: ['./job-offers-list.component.scss']
})
export class JobOffersListComponent implements OnInit {
  jobOffers: JobOffer[] = [];
  filteredJobOffers: JobOffer[] = [];
  displayedJobOffers: JobOffer[] = [];

  // Expose Math for template
  Math = Math;

  // Pagination
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  // Loading
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedPlatform: string = 'ALL';
  platformOptions = ['ALL', 'WTTJ', 'LinkedIn', 'Indeed'];

  // Table columns
  displayedColumns: string[] = [
    'title',
    'company',
    'location',
    'salary',
    'platform',
    'contract',
    'actions'
  ];

  constructor(
    private jobOfferService: JobOfferService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  // Load job offers from backend
  loadJobOffers(): void {
    this.isLoading = true;
    this.jobOfferService.getAllJobOffers(1, 1000).subscribe({
      next: (response) => {
        this.jobOffers = response.data;
        this.totalItems = response.total;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job offers:', error);
        this.isLoading = false;
        this.showError('Erreur lors du chargement des offres d\'emploi');
      }
    });
  }

  // Apply filters and search
  applyFilters(): void {
    let filtered = [...this.jobOffers];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.title?.toLowerCase().includes(term) ||
        offer.locationCity?.toLowerCase().includes(term) ||
        offer.locationCountry?.toLowerCase().includes(term)
      );
    }

    // Apply platform filter
    if (this.selectedPlatform && this.selectedPlatform !== 'ALL') {
      filtered = filtered.filter(offer => offer.platform === this.selectedPlatform);
    }

    this.filteredJobOffers = filtered;
    this.totalItems = filtered.length;
    this.updateDisplayedJobOffers();
  }

  // Update displayed items based on pagination
  updateDisplayedJobOffers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedJobOffers = this.filteredJobOffers.slice(startIndex, endIndex);
  }

  // Pagination controls
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedJobOffers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedJobOffers();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateDisplayedJobOffers();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // View job offer details (open URL in new tab)
  viewJobOffer(offer: JobOffer): void {
    if (offer.offerUrl) {
      window.open(offer.offerUrl, '_blank');
    }
  }

  // Delete job offer
  deleteJobOffer(offer: JobOffer): void {
    if (!offer.id) return;

    const confirmDelete = confirm(
      `Êtes-vous sûr de vouloir supprimer l'offre "${offer.title}" ?`
    );

    if (confirmDelete) {
      this.jobOfferService.deleteJobOffer(offer.id).subscribe({
        next: () => {
          this.showSuccess('Offre d\'emploi supprimée avec succès');
          this.loadJobOffers();
        },
        error: (error) => {
          console.error('Error deleting job offer:', error);
          this.showError('Erreur lors de la suppression de l\'offre');
        }
      });
    }
  }

  // Format salary
  formatSalary(offer: JobOffer): string {
    if (offer.minSalary && offer.maxSalary) {
      return `${offer.minSalary / 1000}k - ${offer.maxSalary / 1000}k€`;
    } else if (offer.minSalary) {
      return `À partir de ${offer.minSalary / 1000}k€`;
    } else if (offer.maxSalary) {
      return `Jusqu'à ${offer.maxSalary / 1000}k€`;
    }
    return 'Non renseigné';
  }

  // Format location
  formatLocation(offer: JobOffer): string {
    const parts = [];
    if (offer.locationCity) parts.push(offer.locationCity);
    if (offer.locationCountry) parts.push(offer.locationCountry);
    return parts.length > 0 ? parts.join(', ') : 'Non renseigné';
  }

  // Get platform color
  getPlatformColor(platform: string | undefined): string {
    switch (platform) {
      case 'WTTJ':
        return 'accent';
      case 'LinkedIn':
        return 'primary';
      case 'Indeed':
        return 'warn';
      default:
        return '';
    }
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/job-track']);
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
}
