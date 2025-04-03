import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Establishment, EstablishmentResponse } from '../../establishment.model';
import { EstablishmentService } from '../../../../services/establishment.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-establishment',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    
  ],
  templateUrl: './all-establishment.component.html',
  styleUrl: './all-establishment.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllEstablishmentComponent implements OnInit {

    establishment: Establishment[] = [];

    loading = true;

    constructor(private establishmentService : EstablishmentService, private snackBar : MatSnackBar){}

    ngOnInit(): void {
      this.loadEstablishment();
    }

      loadEstablishment(): void {

        this.establishmentService.getAllEstablishment().subscribe({
          next: (data: EstablishmentResponse) => {
            this.establishment = data.content || []; 
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des Etablissements :', err);
            this.loading = false;
          }
        });
      }

      deleteEstablishment(id: number): void {

        this.establishmentService.deleteEstablishment(id).subscribe({
          next: (response: string) => {
            console.log('Réponse du backend :', response); // Afficher la réponse pour le débogage
            this.snackBar.open('Etablissement supprimé avec succès !', 'Fermer', { duration: 3000 });
      
            // 🔥 Retirer l'élément supprimé de la liste
            this.establishment = this.establishment.filter(type => type.idEstablishment !== id);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression :', err); // Afficher l'erreur pour le débogage
            this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
          }
        });
      }

}
