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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private establishmentService: EstablishmentService,
    private trainingService: TrainingService
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
  }

  // Charger les établissements
  loadEstablishments(): void {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
      },
      (error) => {
        this.snackBar.open('Erreur lors du chargement des établissements.', 'Fermer', {
          duration: 3000,
        });
      }
    );
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.trainingForm.valid) {
      const trainingData = this.trainingForm.value;
      this.trainingService.createTraining(trainingData).subscribe(
        (response) => {
          this.snackBar.open('Formation enregistrée avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.trainingForm.reset();
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'enregistrement de la formation.', 'Fermer', {
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