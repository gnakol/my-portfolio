import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstablishmentService } from '../../../../services/establishment.service';
import { TrainingService } from '../../../../services/training.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-add-trainings',
  imports : [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule

  ],
  templateUrl: './add-trainings.component.html',
  styleUrls: ['./add-trainings.component.scss']
})
export class AddTrainingsComponent implements OnInit {

  trainingForm: FormGroup;

  establishments: any[] = []; // Liste des établissements

  accountId: number | null = null; // ✅ Stocker l'ID utilisateur

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private establishmentService: EstablishmentService,
    private trainingService: TrainingService,
    private router : Router,
    private accountService : AccountService
  ) {
    this.trainingForm = this.fb.group({
      label: ['', Validators.required],
      diploma: ['', Validators.required],
      yearOfObtaining: ['', Validators.required],
      establishment_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.loadEstablishments();

    this.loadUserId();
  }

  // Charger les établissements
  loadEstablishments(): void {
    this.establishmentService.getAllEstablishment().subscribe({
      next: (data) => {
        this.establishments = data.content || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des établissements :', error);
        this.snackBar.open('Impossible de charger les établissement.', 'Fermer', { duration: 3000 });
      }
    });
  }

      // ✅ Charger l'ID utilisateur depuis le token
      loadUserId(): void {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const email = payload.sub;
    
          this.accountService.getAccountIdByEmail(email).subscribe({
            next: (userId) => {
              this.accountId = userId;
              console.log("✅ ID utilisateur chargé :", this.accountId);
            },
            error: (error) => {
              console.error("❌ Erreur récupération ID utilisateur :", error);
              this.accountId = null;
            }
          });
        }
      }

  // ✅ Soumettre le formulaire
  onSubmit(): void {
    console.log("Formulaire valide ?", this.trainingForm.valid);
    console.log("Valeurs du formulaire :", this.trainingForm.value);

    if (this.trainingForm.valid && this.accountId) {
        const trainingData = {
            ...this.trainingForm.value,
            account_id: this.accountId // ✅ Utilisation directe du formControlName
        };

        console.log("🚀 Données envoyées au backend :", trainingData);

        this.trainingService.addTraining(trainingData).subscribe({
            next: () => {
                this.snackBar.open('Formation enregistrée avec succès !', 'Fermer', { duration: 3000 });
                this.router.navigate(['/trainings']);
            },
            error: () => {
                this.snackBar.open('Erreur lors de l\'enregistrement de la formation.', 'Fermer', { duration: 3000 });
            }
        });
    } else {
        this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
}

}