import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';
import { ProjectDetailComponent } from '../../project-detail/project-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-all-project',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './all-project.component.html',
  styleUrls: ['./all-project.component.scss'],
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
export class AllProjectComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  projectCategories: any[] = [];
  expandedCategory: string | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  loadProjects(): void {
    this.projectService.getAllProject().subscribe({
      next: (data) => {
        this.projects = (data.content || [])
          .map(project => ({
            ...project,
            isCurrent: !project.endDate
          }));

        this.createProjectCategories();
        this.loading = false;
      },
      error: (error) => {
        //console.error('Erreur lors du chargement des projets :', error);
        this.snackBar.open('Impossible de charger les projets.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  createProjectCategories(): void {
    const categories = [
      { name: 'Développement Fullstack', icon: 'code', color: '#4f46e5' },
      { name: 'Infrastructure & Réseaux', icon: 'settings_ethernet', color: '#10b981' },
      { name: 'Administration Système Linux', icon: 'terminal', color: '#3b82f6' },
      { name: 'Projet de reconversion & montée en compétences', icon: 'school', color: '#ec4899' },
      { name: 'Projet en cours & longue durée', icon: 'hourglass_full', color: '#f59e0b' },
      { name: 'Portfolio personnel & démonstratif', icon: 'collections', color: '#8b5cf6' }
    ];

    this.projectCategories = categories.map(category => ({
      ...category,
      projects: this.projects.filter(project => project.projectType?.name === category.name),
      count: this.projects.filter(project => project.projectType?.name === category.name).length
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
      'Développement Fullstack': '#4f46e5',
      'Infrastructure & Réseaux': '#10b981',
      'Administration Système Linux': '#3b82f6',
      'Projet de reconversion & montée en compétences': '#ec4899',
      'Projet en cours & longue durée': '#f59e0b',
      'Portfolio personnel & démonstratif': '#8b5cf6'
    };
    return colors[typeName] || '#64748b';
  }

  viewProject(project: any): void {
    this.dialog.open(ProjectDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'project-modal',
      data: { project }
    });
  }

  deleteProject(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.snackBar.open('Projet supprimé avec succès !', 'Fermer', { duration: 3000 });
          this.projects = this.projects.filter(proj => proj.idProject !== id);
          this.createProjectCategories();
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
      'Développement Fullstack': 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.4) 100%)',
      'Infrastructure & Réseaux': 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%)',
      'Administration Système Linux': 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.4) 100%)',
      'Projet de reconversion & montée en compétences': 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.4) 100%)',
      'Projet en cours & longue durée': 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%)',
      'Portfolio personnel & démonstratif': 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.4) 100%)'
    };
    return gradients[typeName] || 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.4) 100%)';
  }
  
  hasCurrentProject(projects: any[]): boolean {
    return projects.some(proj => !proj.endDate);
  }
  
}