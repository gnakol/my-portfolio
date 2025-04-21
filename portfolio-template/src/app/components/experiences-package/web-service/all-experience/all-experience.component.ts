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
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';
import { ExperienceDetailComponent } from '../../experience-detail/experience-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  styleUrls: ['./all-experience.component.scss'],
  animations: [
    trigger('categoryExpand', [
      state('collapsed', style({ height: '0px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
    ]),
    trigger('categoryFade', [
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, height: 0 }))
      ])
    ])
  ]
})
export class AllExperienceComponent implements OnInit {
  experiences: any[] = [];
  loading = true;
  experienceCategories: any[] = [];
  expandedCategory: string | null = null;

  constructor(
    private experienceService: ExperienceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  loadExperiences(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        this.experiences = (data.content || [])
          .filter(exp => !exp.experienceType || exp.experienceType.name.toLowerCase() !== 'projet')
          .map(exp => ({
            ...exp,
            isCurrent: !exp.endDate
          }));

        this.createExperienceCategories();
        this.loading = false;
      },
      error: (error) => {
        //console.error('Erreur lors du chargement des expériences :', error);
        this.snackBar.open('Impossible de charger les expériences.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  createExperienceCategories(): void {
    const categories = [
      { name: 'CDI', icon: 'verified_user', color: '#4f46e5' },
      { name: 'Stage', icon: 'school', color: '#10b981' },
      { name: 'Alternance', icon: 'workspace_premium', color: '#3b82f6' },
      { name: 'CDD', icon: 'event_available', color: '#ec4899' }
    ];

    this.experienceCategories = categories.map(category => ({
      ...category,
      experiences: this.experiences.filter(exp => exp.experienceType?.name === category.name),
      count: this.experiences.filter(exp => exp.experienceType?.name === category.name).length
    })).filter(cat => cat.count > 0);
  }

  toggleCategory(categoryName: string): void {
    if (this.expandedCategory === categoryName) {
      this.expandedCategory = null;
    } else {
      this.expandedCategory = categoryName;
    }
  }

  getTypeColor(typeName: string): string {
    const colors: {[key: string]: string} = {
      'CDI': '#4f46e5',
      'Stage': '#10b981',
      'Alternance': '#3b82f6',
      'CDD': '#ec4899'
    };
    return colors[typeName] || '#64748b';
  }

  viewExperience(experience: any): void {
    this.dialog.open(ExperienceDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'experience-modal',
      data: { experience }
    });
  }

  deleteExperience(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      this.experienceService.deleteExperience(id).subscribe({
        next: () => {
          this.snackBar.open('Expérience supprimée avec succès !', 'Fermer', { duration: 3000 });
          this.experiences = this.experiences.filter(exp => exp.idExperience !== id);
          this.createExperienceCategories();
        },
        error: (error) => {
          //console.error('Erreur lors de la suppression :', error);
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCategoryBackground(typeName: string): string {
    const gradients: {[key: string]: string} = {
      'CDI': 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.4) 100%)',
      'Stage': 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%)',
      'Alternance': 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.4) 100%)',
      'CDD': 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.4) 100%)'
    };
    return gradients[typeName] || 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.4) 100%)';
  }
  
  hasCurrentExperience(experiences: any[]): boolean {
    return experiences.some(exp => !exp.endDate);
  }
}