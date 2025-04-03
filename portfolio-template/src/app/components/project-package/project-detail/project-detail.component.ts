import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceService } from '../../../services/experience.service';
import { experienceTypeService } from '../../../services/experience_type.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  imports : [
    CommonModule,
    MatIconModule,
    
  ]
})
export class ProjectDetailComponent implements OnInit {
  project: any;

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private experienceService: ExperienceService,
    private experienceTypeService: experienceTypeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data.project) {
      this.project = this.data.project;
      if (!this.project.experienceType && this.project.experienceType_id) {
        this.loadExperienceType(this.project.experienceType_id);
      }
    } else if (this.data.id) {
      this.loadProject(this.data.id);
    }
  }

  loadProject(id: number): void {
    this.experienceService.getExperienceById(id).subscribe({
      next: (project) => {
        this.project = project;
        if (this.project.experienceType_id) {
          this.loadExperienceType(this.project.experienceType_id);
        }
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.snackBar.open('Erreur lors du chargement du projet', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadExperienceType(id: number): void {
    this.experienceTypeService.getExperienceTypeById(id).subscribe({
      next: (type) => {
        this.project.experienceType = type;
      },
      error: (error) => {
        console.error('Error loading experience type:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}