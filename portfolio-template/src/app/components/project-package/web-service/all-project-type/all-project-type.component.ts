import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ProjectTypeService } from '../../../../services/project-type.service';

@Component({
  selector: 'app-all-project-type',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './all-project-type.component.html',
  styleUrls: ['./all-project-type.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllProjectTypeComponent implements OnInit {
  projectTypes: any[] = [];
  loading = true;

  constructor(
    private projectTypeService: ProjectTypeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjectTypes();
  }

  loadProjectTypes(): void {
    this.projectTypeService.getAllProjectTypes().subscribe({
      next: (data) => {
        this.projectTypes = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types de projet :', err);
        this.snackBar.open('Impossible de charger les types de projet', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteProjectType(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de projet ?')) {
      this.projectTypeService.deleteProjectType(id).subscribe({
        next: () => {
          this.snackBar.open('Type de projet supprimé avec succès !', 'Fermer', { duration: 3000 });
          this.projectTypes = this.projectTypes.filter(type => type.idProjectType !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getColorForIndex(index: number): string {
    const colors = ['#f97316', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];
    return colors[index % colors.length];
  }
}