import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceService } from '../../../services/experience.service';
import { experienceTypeService } from '../../../services/experience_type.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-experience-detail',
  templateUrl: './experience-detail.component.html',
  styleUrls: ['./experience-detail.component.scss'],
  imports : [
    CommonModule,
    MatIconModule,
    
  ]
})
export class ExperienceDetailComponent implements OnInit {
  experience: any;
  skillsList: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ExperienceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private experienceService: ExperienceService,
    private experienceTypeService: experienceTypeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.experience = this.data.experience;
    //console.log("voici le contenu de experience via data : ", this.experience);
    
    // Si l'expérience n'est pas complète, charge les détails
    if (this.experience && !this.experience.experienceType && this.experience.experienceType_id) {
      this.loadExperienceDetails(this.experience.idExperience);
    } else {
      this.processSkills();
    }
  }

  loadExperienceDetails(id: number): void {
    this.experienceService.getExperienceById(id).subscribe({
      next: (data) => {
        if (data.experienceType_id) {
          this.experienceTypeService.getExperienceTypeById(data.experienceType_id).subscribe(type => {
            this.experience = {
              ...data,
              experienceType: type
            };
            this.processSkills();
          });
        }
      },
      error: (error) => {
        console.error('Error loading experience details:', error);
        this.snackBar.open('Erreur lors du chargement des détails', 'Fermer', { duration: 3000 });
      }
    });
  }

  processSkills(): void {
    if (this.experience?.skillsAcquired) {
      this.skillsList = this.experience.skillsAcquired.split(',').map((skill: string) => skill.trim());
    }
  }

  getDuration(): string {
    if (!this.experience?.startDate) return '';
    
    const start = new Date(this.experience.startDate);
    const end = this.experience.endDate ? new Date(this.experience.endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    
    if (months < 12) {
      return `${months} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ''}`;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}