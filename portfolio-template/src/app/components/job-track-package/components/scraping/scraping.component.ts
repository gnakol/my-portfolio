import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services
import { JobOfferService } from '../../services/job-offer.service';
import { CompanyService } from '../../services/company.service';
import { CandidacyService } from '../../services/candidacy.service';

// Models
import { ScrapedJobData } from '../../models/job-offer.model';
import { CandidacyStatus } from '../../models/candidacy.model';

// Environment
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-job-track-scraping',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './scraping.component.html',
  styleUrls: ['./scraping.component.scss']
})
export class ScrapingComponent {
  urlForm: FormGroup;
  candidacyForm: FormGroup;

  isLoading = false;
  scrapedData: ScrapedJobData | null = null;
  showCandidacyForm = false;
  isIndeedInProduction = false; // Flag pour Indeed en prod
  indeedManualEntryMessage = ''; // Message explicatif

  candidacyStatuses = Object.values(CandidacyStatus);

  applicationChannels = ['LinkedIn', 'WTTJ', 'Indeed', 'Site Entreprise', 'Email', 'Autre'];
  interestLevels = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private jobOfferService: JobOfferService,
    private companyService: CompanyService,
    private candidacyService: CandidacyService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    this.candidacyForm = this.fb.group({
      companyName: ['', Validators.required],
      companySector: [''],
      companyWebsite: [''],
      jobTitle: ['', Validators.required],
      locationCity: [''],
      locationCountry: [''],
      minSalary: [null],
      maxSalary: [null],
      platform: [''],
      applicationDate: [new Date(), Validators.required],
      currentStatus: [CandidacyStatus.PENDING, Validators.required],
      applicationChannel: [''],
      expectedMinSalary: [null],
      expectedMaxSalary: [null],
      levelOfInterest: [3],
      note: ['']
    });
  }

  async onScrape() {
    if (this.urlForm.invalid) {
      this.snackBar.open('Veuillez entrer une URL valide', 'Fermer', { duration: 3000 });
      return;
    }

    const url = this.urlForm.value.url;

    // 🎯 Détection Indeed + Production = Saisie manuelle
    const isIndeedUrl = url.toLowerCase().includes('indeed.') || url.toLowerCase().includes('indeed.com') || url.toLowerCase().includes('indeed.fr');

    if (isIndeedUrl && environment.production) {
      // Mode saisie manuelle pour Indeed en production
      this.isIndeedInProduction = true;
      this.indeedManualEntryMessage = `🔒 Le scraping automatique d'Indeed n'est pas disponible en production en raison des protections anti-bot de la plateforme. Veuillez saisir les informations manuellement.`;

      // Pré-remplir avec les infos de base
      this.candidacyForm.patchValue({
        platform: 'Indeed',
        applicationChannel: 'Indeed'
      });

      this.showCandidacyForm = true;

      this.snackBar.open('ℹ️ Saisie manuelle requise pour Indeed', 'Fermer', {
        duration: 4000,
        panelClass: ['info-snackbar']
      });

      return;
    }

    // Scraping normal pour WTTJ, LinkedIn, et Indeed en local
    this.isLoading = true;
    this.isIndeedInProduction = false;
    this.indeedManualEntryMessage = '';

    this.jobOfferService.scrapeJobOffer({ url }).subscribe({
      next: (data) => {
        this.scrapedData = data;
        this.prefillCandidacyForm(data);
        this.showCandidacyForm = true;
        this.isLoading = false;
        this.snackBar.open('✅ Données récupérées avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors du scraping:', error);

        let errorMessage = 'Erreur lors du scraping de l\'offre';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'URL invalide ou plateforme non supportée';
        } else if (error.status === 401) {
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        }

        this.snackBar.open(`❌ ${errorMessage}`, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  prefillCandidacyForm(data: ScrapedJobData) {
    this.candidacyForm.patchValue({
      companyName: data.companyName || '',
      companySector: data.companySector || '',
      companyWebsite: data.companyWebsite || '',
      jobTitle: data.title || '',
      locationCity: data.locationCity || '',
      locationCountry: data.locationCountry || '',
      minSalary: data.minSalary || null,
      maxSalary: data.maxSalary || null,
      platform: data.platform || '',
      applicationChannel: data.platform || '',
      // Pré-remplir également les salaires attendus avec les valeurs scrapées
      expectedMinSalary: data.minSalary || null,
      expectedMaxSalary: data.maxSalary || null
    });
  }

  async onCreateCandidacy() {
    if (this.candidacyForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formValue = this.candidacyForm.value;

    try {
      // Step 1: Create or get company
      const company = await this.createCompany(
        formValue.companyName,
        formValue.locationCity,
        formValue.locationCountry,
        formValue.companySector,
        formValue.companyWebsite
      );

      // Step 2: Create job offer
      const jobOffer = await this.createJobOffer(company.id!, formValue);

      // Step 3: Create candidacy (auto-creates 3 reminders J+3, J+7, J+14)
      await this.createCandidacy(company.id!, jobOffer.id!, formValue);

      this.isLoading = false;
      this.snackBar.open('🎉 Candidature créée avec succès ! (3 rappels automatiques créés)', 'Fermer', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      // Reset forms
      this.urlForm.reset();
      this.candidacyForm.reset();
      this.scrapedData = null;
      this.showCandidacyForm = false;

      // Navigate to candidacies list (when we create it)
      // this.router.navigate(['job-track-candidacies']);

    } catch (error: any) {
      this.isLoading = false;
      console.error('Erreur lors de la création de la candidature:', error);

      let errorMessage = 'Erreur lors de la création de la candidature';
      if (error.error?.message) {
        errorMessage = error.error.message;
      }

      this.snackBar.open(`❌ ${errorMessage}`, 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private createCompany(name: string, city?: string, country?: string, sector?: string, website?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyService.createCompany({
        name,
        city: city || '',
        country: country || '',
        sector: sector || '',
        website: website || ''
      }).subscribe({
        next: (company) => resolve(company),
        error: (error) => {
          // If company already exists, we could handle it differently
          // For now, we'll just reject
          reject(error);
        }
      });
    });
  }

  private createJobOffer(companyId: number, formValue: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jobOfferService.createJobOffer({
        companyId,
        title: formValue.jobTitle,
        description: this.scrapedData?.description, // ✅ Add description from scraped data
        locationCity: formValue.locationCity,
        locationCountry: formValue.locationCountry,
        minSalary: formValue.minSalary,
        maxSalary: formValue.maxSalary,
        typeOfContract: this.scrapedData?.typeOfContract, // ✅ Add contract type
        remoteMode: this.scrapedData?.remoteMode, // ✅ Add remote mode
        platform: formValue.platform,
        offerUrl: this.urlForm.value.url,
        scrapedData: this.scrapedData?.rawData || {}
      }).subscribe({
        next: (jobOffer) => resolve(jobOffer),
        error: (error) => reject(error)
      });
    });
  }

  private createCandidacy(companyId: number, jobOfferId: number, formValue: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const applicationDate = new Date(formValue.applicationDate);
      const formattedDate = applicationDate.toISOString().split('T')[0]; // YYYY-MM-DD

      this.candidacyService.createCandidacy({
        companyId,
        jobOfferId,
        applicationDate: formattedDate,
        currentStatus: formValue.currentStatus,
        applicationChannel: formValue.applicationChannel,
        expectedMinSalary: formValue.expectedMinSalary,
        expectedMaxSalary: formValue.expectedMaxSalary,
        levelOfInterest: formValue.levelOfInterest,
        note: formValue.note
      }).subscribe({
        next: (candidacy) => resolve(candidacy),
        error: (error) => reject(error)
      });
    });
  }

  // Get status label in French
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

  onCancel() {
    this.urlForm.reset();
    this.candidacyForm.reset();
    this.scrapedData = null;
    this.showCandidacyForm = false;
    this.isIndeedInProduction = false;
    this.indeedManualEntryMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/job-track-template']);
  }
}
