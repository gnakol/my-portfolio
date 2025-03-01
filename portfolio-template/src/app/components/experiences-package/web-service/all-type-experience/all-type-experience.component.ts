import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceType, ExperienceTypeResponse } from '../../experience-type.model';
import { experienceTypeService } from '../../../../services/experience_type.service';

@Component({
  selector: 'app-all-type-experience',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './all-type-experience.component.html',
  styleUrls: ['./all-type-experience.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllTypeExperienceComponent implements OnInit {

  experienceTypes: ExperienceType[] = [];
  loading = true;

  constructor(private experienceTypeService: experienceTypeService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadExperienceTypes();
  }

  loadExperienceTypes(): void {
    this.experienceTypeService.getAllExperienceTypes().subscribe({
      next: (data: ExperienceTypeResponse) => {
        this.experienceTypes = data.content || []; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d’expériences :', err);
        this.loading = false;
      }
    });
  }

  deleteExperienceType(id: number): void {
    this.experienceTypeService.deleteExperienceType(id).subscribe({
      next: (response: string) => {
        console.log('Réponse du backend :', response); // Afficher la réponse pour le débogage
        this.snackBar.open('Type d\'expérience supprimé avec succès !', 'Fermer', { duration: 3000 });
  
        // 🔥 Retirer l'élément supprimé de la liste
        this.experienceTypes = this.experienceTypes.filter(type => type.idExperienceType !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err); // Afficher l'erreur pour le débogage
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }
}
