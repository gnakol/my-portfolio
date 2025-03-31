import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TrainingService } from '../../../../services/training.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-trainings',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './all-trainings.component.html',
  styleUrls: ['./all-trainings.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllTrainingsComponent implements OnInit {
  trainings: any[] = [];
  loading = true;

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getAllTraining().subscribe({
      next: (data) => {
        this.trainings = (data.content || []).sort((a, b) => 
          new Date(b.yearOfObtaining).getTime() - new Date(a.yearOfObtaining).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations :', err);
        this.snackBar.open('Impossible de charger les formations.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteTraining(id: number): void {
    this.trainingService.deleteTraining(id).subscribe({
      next: () => {
        this.snackBar.open('Formation supprimée avec succès !', 'Fermer', { duration: 3000 });
        this.trainings = this.trainings.filter(training => training.idTraining !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  navigateToTemplate(): void {
    this.router.navigate(['/training-template']);
  }
}