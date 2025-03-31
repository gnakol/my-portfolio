import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { experienceTypeService } from '../../../../services/experience_type.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-type-experience',
  templateUrl: './add-type-experience.component.html',
  styleUrls: ['./add-type-experience.component.scss'],
  imports : [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AddTypeExperienceComponent {
  typeExperienceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private experienceTypeService: experienceTypeService,
    private router: Router
  ) {
    this.typeExperienceForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.typeExperienceForm.valid) {
      this.experienceTypeService.addExperienceType(this.typeExperienceForm.value).subscribe({
        next: () => {
          this.snackBar.open('Type d\'expérience ajouté avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/all-experiences-type']);
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'ajout du type d\'expérience', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire', 'Fermer', { duration: 3000 });
    }
  }
}