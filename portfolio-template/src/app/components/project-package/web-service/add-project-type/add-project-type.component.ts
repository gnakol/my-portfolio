import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTypeService } from '../../../../services/project-type.service'; // Service spécifique aux types de projets
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Ajout de MatInputModule

@Component({
  selector: 'app-add-project-type',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule // Ajout ici
  ],
  templateUrl: './add-project-type.component.html',
  styleUrls: ['./add-project-type.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AddProjectTypeComponent {
  projectTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private projectTypeService: ProjectTypeService, // Injection du service spécifique aux types de projets
    private router: Router
  ) {
    this.projectTypeForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectTypeForm.valid) {
      this.projectTypeService.addProjectType(this.projectTypeForm.value).subscribe({
        next: () => {
          this.snackBar.open('Type de projet ajouté avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/all-project-types']); // Redirection vers la liste des types de projets
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'ajout du type de projet', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire', 'Fermer', { duration: 3000 });
    }
  }
}