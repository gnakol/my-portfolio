import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { experienceTypeService } from '../../../../services/experience_type.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-type-experience',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-type-experience.component.html',
  styleUrls: ['./add-type-experience.component.scss']
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

  // Soumettre le formulaire et rediriger vers la liste
  onSubmit(): void {
    if (this.typeExperienceForm.valid) {
      const experienceTypeData = this.typeExperienceForm.value;
      this.experienceTypeService.addExperienceType(experienceTypeData).subscribe(
        (response) => {
          this.snackBar.open('Type d\'expérience ajouté avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/all-experiences-type']); // 🔥 Redirection après succès
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'ajout du type d\'expérience.', 'Fermer', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', {
        duration: 3000,
      });
    }
  }
}
