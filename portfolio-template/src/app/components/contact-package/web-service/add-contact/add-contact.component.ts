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
import { ContactService } from '../../../../services/contact.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {
  @Output() contactSubmitted = new EventEmitter<any>();
  contactForm: FormGroup;
  isSubmitting = false;

  countries = [
    { name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { name: 'Guinée', dialCode: '+224', flag: '🇬🇳' },
    { name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
    { name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
    { name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
    { name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
    { name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
    { name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  ];
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddContactComponent>,
    private contactService : ContactService
    
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      countryCode: ['+33'], // valeur par défaut
      localPhone: [
        '',
        [Validators.pattern(/^[0-9]{6,14}$/)]
      ],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
    
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
  
      const formValue = this.contactForm.value;
  
      const contactData = {
        name: formValue.name,
        email: formValue.email,
        telephone: formValue.localPhone ? `${formValue.countryCode}${formValue.localPhone}` : null,
        message: formValue.message
      };
  
      this.contactService.createContact(contactData).subscribe({
        next: (response) => {
          console.log('Contact ajouté avec succès:', response);
          this.contactSubmitted.emit(contactData);
          this.isSubmitting = false;
          this.dialogRef.close(contactData);
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