import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../../services/experience.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AllExperienceComponent } from '../../../components/experiences-package/web-service/all-experience/all-experience.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [
    CommonModule, // Requis pour les directives standard (ex : *ngFor)
    MatCardModule, // Requis pour <mat-card>
    MatButtonModule, // Requis pour <button mat-raised-button>
    //AllExperienceComponent
  ],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent implements OnInit {

  email: string = 'gna.kolie@yahoo.fr';

  experiences: any[] = [];

  selectedSection: string | null = null; // 🔥 Nouvelle variable pour stocker la section sélectionnée

  constructor(private experienceService: ExperienceService, private router : Router) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.experienceService.getAllExperiences().subscribe(data => {
      this.experiences = data.content; // API retourne une `Page`
    });
  }

  deleteExperience(id: number): void {
    this.experienceService.deleteExperience(id).subscribe(() => {
      this.experiences = this.experiences.filter(exp => exp.idExperience !== id);
    });
  }

  showSection(section: string) {
    this.router.navigate([section]);
  }
}
