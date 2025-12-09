import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Company } from '../../models/company.model';

export interface CompanyEditModalData {
  company?: Company;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-company-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './company-edit-modal.component.html',
  styleUrls: ['./company-edit-modal.component.scss']
})
export class CompanyEditModalComponent implements OnInit {
  companyForm!: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyEditModalData
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: [this.data.company?.name || '', [Validators.required, Validators.maxLength(255)]],
      sector: [this.data.company?.sector || '', [Validators.maxLength(255)]],
      city: [this.data.company?.city || '', [Validators.maxLength(255)]],
      country: [this.data.company?.country || '', [Validators.maxLength(255)]],
      website: [this.data.company?.website || '', [Validators.maxLength(512)]],
      personal_note: [this.data.company?.personal_note || ''],
      recruiter_note: [this.data.company?.recruiter_note || '']
    });
  }

  getTitle(): string {
    return this.isEditMode ? 'Modifier l\'entreprise' : 'Nouvelle entreprise';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Mettre à jour' : 'Créer';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formValue = this.companyForm.value;

      // Remove empty fields
      Object.keys(formValue).forEach(key => {
        if (formValue[key] === '' || formValue[key] === null) {
          delete formValue[key];
        }
      });

      this.dialogRef.close({
        data: formValue,
        mode: this.data.mode
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.companyForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Maximum ${maxLength} caractères`;
    }

    return '';
  }
}
