import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Experience } from '../../experience.model';
import { ExperienceService } from '../../../../services/experience.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-all-experience',
  standalone: true,
  imports: [
    CommonModule, // Requis pour les directives standard (ex : *ngFor)
    MatCardModule, // Requis pour <mat-card>
    MatButtonModule, // Requis pour <button mat-raised-button>
  ],
  templateUrl: './all-experience.component.html',
  styleUrls: ['./all-experience.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllExperienceComponent implements OnInit {

  experiences: Experience[] = [];
  loading = true; // Pour gérer le chargement

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        this.experiences = data.content || []; // ✅ Correction ici : on prend `data.content`
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des expériences :', err);
        this.loading = false;
      }
    });
  }
}
