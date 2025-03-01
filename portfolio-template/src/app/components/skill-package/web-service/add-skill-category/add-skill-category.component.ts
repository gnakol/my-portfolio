import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SkillCategoryService } from '../../../../services/category_skill.service';

@Component({
  selector: 'app-add-skill-category',
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
  templateUrl: './add-skill-category.component.html',
  styleUrl: './add-skill-category.component.scss'
})
export class AddSkillCategoryComponent {

  skillCategoryForm: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private skillCategoryService: SkillCategoryService,
      private router: Router
    ) {
      this.skillCategoryForm = this.fb.group({
        name: ['', Validators.required]
      });
    }
  
    // Soumettre le formulaire et rediriger vers la liste
    onSubmit(): void {
      if (this.skillCategoryForm.valid) {

        const skillCategoryData = this.skillCategoryForm.value;
        
        this.skillCategoryService.addSkillCategory(skillCategoryData).subscribe(
          (response) => {
            this.snackBar.open('Type d\'expérience ajouté avec succès !', 'Fermer', {
              duration: 3000,
            });
            this.router.navigate(['/all-skill-category']); // 🔥 Redirection après succès
          },
          (error) => {
            this.snackBar.open('Erreur lors de l\'ajout du type de competence.', 'Fermer', {
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
