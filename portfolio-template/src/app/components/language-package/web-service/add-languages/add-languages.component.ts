import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from '../../../../services/language.service';
import { ReactiveFormsModule } from '@angular/forms';


// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Ajouté pour MatSnackBar
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core'; // ✅ Ajouté ici

@Component({
  selector: 'app-add-languages',
  imports : [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule, 
    MatSelectModule,
    MatNativeDateModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-languages.component.html',
  styleUrls: ['./add-languages.component.scss']
})
export class AddLanguagesComponent {
  languageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private languageService: LanguageService
  ) {
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      proficiencyLevel: ['', Validators.required]
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.languageForm.valid) {
      const languageData = this.languageForm.value;
      this.languageService.createLanguage(languageData).subscribe(
        (response) => {
          this.snackBar.open('Langue enregistrée avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.languageForm.reset();
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'enregistrement de la langue.', 'Fermer', {
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