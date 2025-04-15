import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExperienceService } from '../../../../services/experience.service';
import { experienceTypeService } from '../../../../services/experience_type.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailComponent } from '../../project-detail/project-detail.component';
import { ProjectCategoryService } from '../../../../services/project-category.service';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DatePipe
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
export class AllProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  projectCategories: any[] = [];
  expandedCategory: string | null = null;

  constructor(
    private experienceService: ExperienceService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private projectCategoryService: ProjectCategoryService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        const allExperiences = data.content || [];
        
        // Filtrer les projets (type_id = 9 pour 'Projet' dans votre DB)
        this.projects = allExperiences.filter(exp => 
          (exp.experienceType?.name === 'Projet') || 
          (exp.experienceType_id === 9)
        );

        this.createProjectCategories();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
        this.loading = false;
      }
    });
  }

  createProjectCategories(): void {
    // Récupérer les catégories depuis le service
    const categories = this.projectCategoryService.getCategories();
    
    // Préparer les catégories avec leurs projets
    this.projectCategories = categories.map(category => {
      const projects = this.filterProjectsByCategory(category.type);
      return {
        ...category,
        projects: projects,
        count: projects.length
      };
    }).filter(cat => cat.count > 0); // Ne garder que les catégories avec des projets
  }

  filterProjectsByCategory(categoryType: string): any[] {
    return this.projects.filter(project => {
      // Récupérer la catégorie du projet via le service
      const projectCategory = this.projectCategoryService.getProjectCategory(project);
      return projectCategory.type === categoryType;
    });
  }

  toggleCategory(categoryName: string): void {
    this.expandedCategory = this.expandedCategory === categoryName ? null : categoryName;
  }

  getTypeColor(typeName: string): string {
    const category = this.projectCategoryService.getCategories().find(c => c.name === typeName);
    return category ? category.color : '#64748b';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  viewProjectDetails(project: any): void {
    this.dialog.open(ProjectDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'project-modal',
      data: { project }
    });
  }
}