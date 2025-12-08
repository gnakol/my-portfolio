import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Models & Services
import { Candidacy, CandidacyStatus } from '../../models/candidacy.model';
import { CandidacyService } from '../../services/candidacy.service';

@Component({
  selector: 'app-edit-candidacy-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-candidacy-modal.component.html',
  styleUrls: ['./edit-candidacy-modal.component.scss']
})
export class EditCandidacyModalComponent implements OnInit {
  candidacy: Candidacy;
  editForm!: FormGroup;
  isSubmitting = false;

  // Status options
  statusOptions = Object.values(CandidacyStatus);

  // Interest levels
  interestLevels = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private candidacyService: CandidacyService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditCandidacyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidacy: Candidacy }
  ) {
    this.candidacy = data.candidacy;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // Initialize form with candidacy data
  initForm(): void {
    this.editForm = this.fb.group({
      applicationDate: [
        this.candidacy.applicationDate ? new Date(this.candidacy.applicationDate) : new Date(),
        Validators.required
      ],
      currentStatus: [this.candidacy.currentStatus, Validators.required],
      applicationChannel: [this.candidacy.applicationChannel || ''],
      expectedMinSalary: [this.candidacy.expectedMinSalary || null],
      expectedMaxSalary: [this.candidacy.expectedMaxSalary || null],
      note: [this.candidacy.note || ''],
      levelOfInterest: [this.candidacy.levelOfInterest || null]
    });
  }

  // Submit form
  onSubmit(): void {
    if (this.editForm.invalid || !this.candidacy.id) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.editForm.value;
    const updateData: Partial<Candidacy> = {
      applicationDate: formValue.applicationDate,
      currentStatus: formValue.currentStatus,
      applicationChannel: formValue.applicationChannel || undefined,
      expectedMinSalary: formValue.expectedMinSalary || undefined,
      expectedMaxSalary: formValue.expectedMaxSalary || undefined,
      note: formValue.note || undefined,
      levelOfInterest: formValue.levelOfInterest || undefined
    };

    this.candidacyService.updateCandidacy(this.candidacy.id, updateData).subscribe({
      next: (updatedCandidacy) => {
        this.isSubmitting = false;
        this.showSuccess('Candidature modifiée avec succès');
        this.dialogRef.close(updatedCandidacy);
      },
      error: (error) => {
        console.error('Error updating candidacy:', error);
        this.isSubmitting = false;
        this.showError('Erreur lors de la modification de la candidature');
      }
    });
  }

  // Close modal
  close(): void {
    this.dialogRef.close();
  }

  // Get status label
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
