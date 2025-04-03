import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {
  @Output() contactSubmitted = new EventEmitter<any>();
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddContactComponent>,
    private contactService : ContactService
    
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[0-9\s\-\.]+$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Utilisez le service pour envoyer les données à l'API
      this.contactService.createContact(this.contactForm.value).subscribe({
        next: (response) => {
          console.log('Contact ajouté avec succès:', response);
          this.contactSubmitted.emit(this.contactForm.value); // Émettez l'événement
          this.isSubmitting = false;
          this.dialogRef.close(this.contactForm.value); // Fermez la boîte de dialogue
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du contact:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}