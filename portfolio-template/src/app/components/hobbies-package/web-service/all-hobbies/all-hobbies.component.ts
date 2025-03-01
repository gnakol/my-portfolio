import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HobbiesService } from '../../../../services/hobbies.service';
import { Hobbies } from '../../hobbies.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-hobbies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './all-hobbies.component.html',
  styleUrls: ['./all-hobbies.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllHobbiesComponent implements OnInit {
  hobbies: Hobbies[] = [];
  loading = true;

  constructor(private hobbiesService: HobbiesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadHobbies();
  }

  loadHobbies(): void {
    this.hobbiesService.allHobbies().subscribe({
      next: (data) => {
        console.log('Données des hobbies:', data);
        this.hobbies = data.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hobbies :', err);
        this.loading = false;
      }
    });
  }

  deleteHobby(id: number): void {
    this.hobbiesService.deleteHobby(id).subscribe({
      next: () => {
        this.snackBar.open('Centre d\'intérêt supprimé avec succès !', 'Fermer', { duration: 3000 });
        this.hobbies = this.hobbies.filter((hobby) => hobby.idHobbies !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression du centre d\'intérêt.', 'Fermer', { duration: 3000 });
      }
    });
  }
}
