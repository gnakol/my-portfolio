import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Training } from '../../training.model';
import { TrainingService } from '../../../../services/training.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EstablishmentService } from '../../../../services/establishment.service';

@Component({
  selector: 'app-all-trainings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './all-trainings.component.html',
  styleUrls: ['./all-trainings.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllTrainingsComponent implements OnInit {
  trainings: Training[] = [];
  loading = true;

  constructor(private trainingService: TrainingService, private establishmentService : EstablishmentService) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.allTraining().subscribe({
      next: (data) => {
        this.trainings = data.content;

        // 🔥 Boucle sur les formations pour récupérer les établissements
        this.trainings.forEach((training) => {
          if (training.establishment_id) {
            this.establishmentService.getEstablishmentById(training.establishment_id).subscribe(establishment => {
              training.establishment = establishment; // 🔥 Remplace l’ID par l’objet complet
            });
          } else {
            training.establishment = { id: -1, name: 'Établissement inconnu', city: 'Ville inconnue' }; // ✅ Correction ici
          }
        });
        

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations :', err);
        this.loading = false;
      }
    });
  }
}
