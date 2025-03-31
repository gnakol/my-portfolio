import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../../../services/experience.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-all-experience',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
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
        this.experiences = (data.content || []).map(exp => ({
          ...exp,
          isCurrent: !exp.endDate
        }));
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
        this.experiences = this.experiences.filter(exp => exp.idExperience !== id);
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