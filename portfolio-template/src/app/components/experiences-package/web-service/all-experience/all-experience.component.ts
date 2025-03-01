import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../../../services/experience.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-experience',
  imports : [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule, // Ajouté ici
        MatDatepickerModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatNativeDateModule
  ],
  templateUrl: './all-experience.component.html',
  styleUrls: ['./all-experience.component.scss']
})
export class AllExperienceComponent implements OnInit {
  experiences: any[] = [];
  loading = true;

  constructor(
    private experienceService: ExperienceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        this.experiences = data.content || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des expériences :', error);
        this.snackBar.open('Impossible de charger les expériences.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  viewExperience(id: number): void {
    this.router.navigate(['/experience-detail', id]);
  }

  deleteExperience(id: number): void {
    this.experienceService.deleteExperience(id).subscribe({
      next: () => {
        this.snackBar.open('Expérience supprimée avec succès !', 'Fermer', { duration: 3000 });
        this.experiences = this.experiences.filter((exp) => exp.id !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  navigateToTemplate(): void {
    this.router.navigate(['/experience-template']);
  }
}