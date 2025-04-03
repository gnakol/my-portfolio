import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;

  constructor(
    private experienceService: ExperienceService,
    private experienceTypeService: experienceTypeService,
    private authService : AuthenticationService,
    private dialog : MatDialog

  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        const allExperiences = data.content || [];
        
        // Filtrer les projets
        this.projects = allExperiences.filter(exp => 
          exp.experienceType?.name === 'Projet' || 
          (exp.experienceType_id && this.getExperienceTypeName(exp.experienceType_id) === 'Projet')
        );

        // Charger les types manquants si nécessaire
        this.loadMissingExperienceTypes();
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
        this.loading = false;
      }
    });
  }

  private getExperienceTypeName(typeId: number): string {
    // Implémentez cette méthode selon votre structure de données
    return '';
  }

  private loadMissingExperienceTypes(): void {
    this.projects.forEach(project => {
      if (!project.experienceType && project.experienceType_id) {
        this.experienceTypeService.getExperienceTypeById(project.experienceType_id).subscribe({
          next: (type) => {
            project.experienceType = type;
          },
          error: (err) => {
            console.error('Erreur lors du chargement du type d\'expérience :', err);
          }
        });
      }
    });
  }

  isAdmin() : boolean
  {
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