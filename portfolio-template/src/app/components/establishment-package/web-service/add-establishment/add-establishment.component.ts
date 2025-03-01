import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstablishmentService } from '../../../../services/establishment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-establishment',
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
  templateUrl: './add-establishment.component.html',
  styleUrl: './add-establishment.component.scss'
})
export class AddEstablishmentComponent {

    establishmenForm!: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private establishmentService: EstablishmentService,
      private router: Router
    ) {
      this.establishmenForm = this.fb.group({
        name: ['', Validators.required],
        city: ['', Validators.required]
      });
    }
  
    // Soumettre le formulaire et rediriger vers la liste
    onSubmit(): void {
      if (this.establishmenForm.valid) {
        const establishementData = this.establishmenForm.value;
        this.establishmentService.addEstablishment(establishementData).subscribe(
          (response) => {
            this.snackBar.open('Etablishment ajouté avec succès !', 'Fermer', {
              duration: 3000,
            });
            this.router.navigate(['/all-establishment']); // 🔥 Redirection après succès
          },
          (error) => {
            this.snackBar.open('Erreur lors de l\'ajout d\'un établissement.', 'Fermer', {
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
