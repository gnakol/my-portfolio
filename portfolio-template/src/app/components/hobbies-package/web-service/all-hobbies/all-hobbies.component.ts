import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HobbiesService } from '../../../../services/hobbies.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-hobbies',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
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
  hobbies: any[] = [];
  loading = true;

  constructor(
    private hobbiesService: HobbiesService,
    private snackBar: MatSnackBar,
    private authService : AuthenticationService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadHobbies();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  loadHobbies(): void {
    this.hobbiesService.allHobbies().subscribe({
      next: (data) => {
        this.hobbies = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        //console.error('Erreur lors du chargement des hobbies :', err);
        this.snackBar.open('Impossible de charger les centres d\'intérêt', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getHobbyIcon(hobbyName: string): string {
    const icons: Record<string, string> = {
      'Musique': 'music_note',
      'Sport': 'sports',
      'Lecture': 'menu_book',
      'Voyage': 'flight',
      'Photographie': 'camera_alt',
      'Cinéma': 'movie',
      'Jeux vidéo': 'sports_esports',
      'Cuisine': 'restaurant',
      'Art': 'palette',
      'Technologie': 'computer'
    };

    // Trouve l'icône correspondante ou utilise une icône par défaut
    for (const key in icons) {
      if (hobbyName.toLowerCase().includes(key.toLowerCase())) {
        return icons[key];
      }
    }
    return 'favorite'; // Icône par défaut
  }

  deleteHobby(id: number): void {
    this.hobbiesService.deleteHobby(id).subscribe({
      next: () => {
        this.snackBar.open('Centre d\'intérêt supprimé avec succès !', 'Fermer', { duration: 3000 });
        this.hobbies = this.hobbies.filter(hobby => hobby.idHobbies !== id);
      },
      error: (error) => {
        //console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  isAdmin() : boolean
  {
    return this.authService.isAdmin();
  }
}