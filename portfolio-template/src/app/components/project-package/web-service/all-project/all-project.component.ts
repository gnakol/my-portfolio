import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ExperienceService } from '../../../../services/experience.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Experience } from '../../../experiences-package/experience.model';
import { experienceTypeService } from '../../../../services/experience_type.service';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
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

  projects: Experience[] = [];

  loading = true;

  constructor(private experienceService: ExperienceService, private experienceTypeService : experienceTypeService) {}

  ngOnInit(): void {
     
    this.loadProjects();
  }

  loadProjects(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        console.log('Données reçues des expériences:', data);
  
        this.projects = data.content.map((project: Experience) => ({
          ...project,
          experienceType: project.experienceType || null
        }));
  
        let pendingRequests = 0;
  
        this.projects.forEach((project: Experience) => {
          if (!project.experienceType && project.experienceType_id) {
            pendingRequests++;
            this.experienceTypeService.getExperienceTypeById(project.experienceType_id).subscribe(type => {
              project.experienceType = { id: type.idExperienceType, name: type.name };
              pendingRequests--;
  
              if (pendingRequests === 0) {
                // 🔥 Filtrer après récupération complète
                this.projects = this.projects.filter((exp: Experience) => exp.experienceType?.name === 'Projet');
                console.log('Projets filtrés:', this.projects);
              }
            });
          }
        });
  
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
        this.loading = false;
      }
    });
  }
}
