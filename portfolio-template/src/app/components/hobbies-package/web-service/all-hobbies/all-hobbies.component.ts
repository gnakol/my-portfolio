import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AllHobbiesComponent implements OnInit, OnDestroy {
  hobbies: any[] = [];
  loading = true;
  selectedFace: string = '';
  autoRotate = true;
  currentRotation = 0;
  private rotationInterval: any;

  passionData = {
    hiphop: {
      title: 'Hip-Hop Freestyle & Chorégraphie',
      icon: '💃',
      description: 'Entre le travail d\'équipe des chorégraphies et l\'intensité des battles, le hip-hop m\'a appris à improviser et m\'adapter rapidement. Ces compétences se retrouvent dans ma façon de coder et résoudre des problèmes IT avec créativité.',
      skills: ['Improvisation', 'Travail d\'équipe', 'Créativité', 'Adaptabilité']
    },
    humour: {
      title: 'Stand-Up & Spectacles d\'Humour',
      icon: '😂',
      description: 'J\'observe comment les artistes captivent leur public par la précision, le rythme et l\'authenticité. Cela renforce mes compétences en communication technique et en storytelling.',
      skills: ['Storytelling', 'Communication', 'Écoute active', 'Présentation']
    },
    gym: {
      title: 'Gymnastique & Acrobaties',
      icon: '🤸',
      description: 'La gymnastique m\'a forgé la persévérance, la rigueur et le dépassement de soi. Des qualités essentielles pour résoudre des bugs complexes et apprendre de nouvelles technologies.',
      skills: ['Persévérance', 'Rigueur', 'Dépassement', 'Précision']
    },
    tech: {
      title: 'Technologie & Innovation',
      icon: '💻',
      description: 'Passionné par les nouvelles technologies et l\'innovation, j\'aime explorer les dernières tendances et outils pour rester à la pointe dans mon domaine.',
      skills: ['Veille techno', 'Innovation', 'Curiosité', 'Apprentissage continu']
    }
  };

  constructor(
    private hobbiesService: HobbiesService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHobbies();
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
  }

  get cubeTransform(): string {
    return `rotateY(${this.currentRotation}deg)`;
  }

  startAutoRotation(): void {
    this.rotationInterval = setInterval(() => {
      if (this.autoRotate && !this.selectedFace) {
        this.currentRotation += 90;
      }
    }, 3000);
  }

  stopAutoRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
  }

  rotateCube(direction: 'left' | 'right'): void {
    this.currentRotation += direction === 'right' ? 90 : -90;
  }

  selectFace(face: string): void {
    this.selectedFace = face;
    this.autoRotate = false;
  }

  closeDetails(): void {
    this.selectedFace = '';
    this.autoRotate = true;
  }

  getFaceIcon(face: string): string {
    return this.passionData[face as keyof typeof this.passionData]?.icon || '⭐';
  }

  getFaceTitle(face: string): string {
    return this.passionData[face as keyof typeof this.passionData]?.title || '';
  }

  getFaceDescription(face: string): string {
    return this.passionData[face as keyof typeof this.passionData]?.description || '';
  }

  getFaceSkills(face: string): string[] {
    return this.passionData[face as keyof typeof this.passionData]?.skills || [];
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
        this.snackBar.open('Impossible de charger les centres d\'intérêt', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}