import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HobbiesService } from '../../../../services/hobbies.service';
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
  selector: 'app-add-hobbies',
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
  templateUrl: './add-hobbies.component.html',
  styleUrls: ['./add-hobbies.component.scss']
})
export class AddHobbiesComponent {
  hobbyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private hobbiesService: HobbiesService
  ) {
    this.hobbyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.hobbyForm.valid) {
      const hobbyData = this.hobbyForm.value;
      this.hobbiesService.createHobby(hobbyData).subscribe(
        (response) => {
          this.snackBar.open('Centre d\'intérêt enregistré avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.hobbyForm.reset();
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'enregistrement du centre d\'intérêt.', 'Fermer', {
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