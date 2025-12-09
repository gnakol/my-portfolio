import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CompanyEditModalComponent } from '../company-edit-modal/company-edit-modal.component';
import { CompanyDetailsModalComponent } from '../company-details-modal/company-details-modal.component';

@Component({
  selector: 'app-companies-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './companies-dashboard.component.html',
  styleUrls: ['./companies-dashboard.component.scss']
})
export class CompaniesDashboardComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  totalCompanies = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  // Search & Filters
  searchTerm = '';
  selectedSector: string | null = null;
  selectedCountry: string | null = null;

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;

    this.companyService.getAllCompanies(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.companies = response.data;
        this.totalCompanies = response.total;
        this.filteredCompanies = [...this.companies];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading companies:', err);
        this.error = 'Erreur lors du chargement des entreprises';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCompanies();
  }

  applyFilters(): void {
    this.filteredCompanies = this.companies.filter(company => {
      const matchesSearch = !this.searchTerm ||
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.sector?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSector = !this.selectedSector || company.sector === this.selectedSector;
      const matchesCountry = !this.selectedCountry || company.country === this.selectedCountry;

      return matchesSearch && matchesSector && matchesCountry;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSector = null;
    this.selectedCountry = null;
    this.applyFilters();
  }

  getUniqueSectors(): string[] {
    const sectors = this.companies
      .map(c => c.sector)
      .filter((sector): sector is string => !!sector);
    return [...new Set(sectors)].sort();
  }

  getUniqueCountries(): string[] {
    const countries = this.companies
      .map(c => c.country)
      .filter((country): country is string => !!country);
    return [...new Set(countries)].sort();
  }

  getCompaniesWithWebsiteCount(): number {
    return this.companies.filter(c => c.website).length;
  }

  getSectorIcon(sector?: string): string {
    if (!sector) return 'business';

    const sectorLower = sector.toLowerCase();
    if (sectorLower.includes('tech') || sectorLower.includes('it')) return 'computer';
    if (sectorLower.includes('finance') || sectorLower.includes('banque')) return 'account_balance';
    if (sectorLower.includes('santé') || sectorLower.includes('health')) return 'local_hospital';
    if (sectorLower.includes('éducation') || sectorLower.includes('education')) return 'school';
    if (sectorLower.includes('commerce') || sectorLower.includes('retail')) return 'shopping_cart';
    if (sectorLower.includes('industrie') || sectorLower.includes('manufacturing')) return 'factory';

    return 'business';
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  openWebsite(url?: string): void {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  }

  viewCompanyDetails(company: Company): void {
    const dialogRef = this.dialog.open(CompanyDetailsModalComponent, {
      data: company,
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        this.editCompany(result.company);
      } else if (result?.action === 'delete') {
        this.deleteCompany(result.company);
      }
    });
  }

  editCompany(company: Company): void {
    const dialogRef = this.dialog.open(CompanyEditModalComponent, {
      data: { company, mode: 'edit' },
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.mode === 'edit') {
        this.companyService.updateCompany(company.id!, result.data).subscribe({
          next: () => {
            this.loadCompanies();
          },
          error: (err) => {
            console.error('Error updating company:', err);
            this.error = 'Erreur lors de la mise à jour de l\'entreprise';
          }
        });
      }
    });
  }

  deleteCompany(company: Company): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${company.name} ?`)) {
      this.companyService.deleteCompany(company.id!).subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (err) => {
          console.error('Error deleting company:', err);
          this.error = 'Erreur lors de la suppression de l\'entreprise';
        }
      });
    }
  }

  addNewCompany(): void {
    const dialogRef = this.dialog.open(CompanyEditModalComponent, {
      data: { mode: 'create' },
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.mode === 'create') {
        this.companyService.createCompany(result.data).subscribe({
          next: () => {
            this.loadCompanies();
          },
          error: (err) => {
            console.error('Error creating company:', err);
            this.error = 'Erreur lors de la création de l\'entreprise';
          }
        });
      }
    });
  }
}
