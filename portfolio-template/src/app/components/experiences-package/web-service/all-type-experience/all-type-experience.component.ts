import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { experienceTypeService } from '../../../../services/experience_type.service';

@Component({
  selector: 'app-all-type-experience',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './all-type-experience.component.html',
  styleUrls: ['./all-type-experience.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllTypeExperienceComponent implements OnInit {
  experienceTypes: any[] = [];
  loading = true;

  constructor(
    private experienceTypeService: experienceTypeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExperienceTypes();
  }

  loadExperienceTypes(): void {
    this.experienceTypeService.getAllExperienceTypes().subscribe({
      next: (data) => {
        this.experienceTypes = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        // console.error('Erreur lors du chargement des types d\'expérience :', err);
        this.snackBar.open('Impossible de charger les types d\'expérience', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteExperienceType(id: number): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce type d\'expérience ?')) {
      this.experienceTypeService.deleteExperienceType(id).subscribe({
        next: () => {
          this.snackBar.open('Type d\'expérience supprimé avec succès !', 'Fermer', { duration: 3000 });
          this.experienceTypes = this.experienceTypes.filter(type => type.idExperienceType !== id);
        },
        error: (error) => {
          // console.error('Erreur lors de la suppression :', error);
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getColorForIndex(index: number): string {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];
    return colors[index % colors.length];
  }
}