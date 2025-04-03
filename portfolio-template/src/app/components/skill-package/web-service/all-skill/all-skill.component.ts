import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SkillService } from '../../../../services/skill.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { SkillDetailComponent } from '../../skill-detail/skill-detail.component';

@Component({
  selector: 'app-all-skill',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './all-skill.component.html',
  styleUrls: ['./all-skill.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllSkillComponent implements OnInit {
  skills: any[] = [];
  loading = true;

  constructor(
    private skillService: SkillService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService : AuthenticationService,
    private dialog : MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getAllSkill().subscribe({
      next: (data) => {
        this.skills = data.content || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des compétences :', error);
        this.snackBar.open('Impossible de charger les compétences.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getCategoryColor(categoryName: string | undefined): string {
    if (!categoryName) return '#6366f1';
    
    const colors: Record<string, string> = {
      'Développement': '#6366f1',
      'Réseaux': '#3b82f6',
      'Cybersécurité': '#ec4899',
      'Système': '#10b981',
      'Cloud': '#f59e0b'
    };

    return colors[categoryName] || '#8b5cf6';
  }

  getSkillIcon(skillName: string): string {
    const icons: Record<string, string> = {
      'Java': 'code',
      'Spring Boot': 'spring',
      'Angular': 'angular',
      'Réseaux': 'settings_ethernet',
      'Cybersécurité': 'security',
      'Cisco': 'router',
      'Linux': 'terminal',
      'Docker': 'docker',
      'AWS': 'cloud',
      'API REST': 'api'
    };

    // Trouve l'icône correspondante ou utilise une icône par défaut
    for (const key in icons) {
      if (skillName.toLowerCase().includes(key.toLowerCase())) {
        return icons[key];
      }
    }
    return 'star'; // Icône par défaut
  }

  deleteSkill(id: number): void {
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.snackBar.open('Compétence supprimée avec succès !', 'Fermer', { duration: 3000 });
        this.skills = this.skills.filter(skill => skill.idSkill !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  navigateToTemplate(): void {
    this.router.navigate(['/skill-template']);
  }

  isAdmin() : boolean
  {
    return this.authService.isAdmin();
  }

  viewSkill(skill: any): void {
    // Ajoute la classe au body
    document.body.classList.add('modal-backdrop-blur');
    
    const dialogRef = this.dialog.open(SkillDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'skill-modal',
      data: { skill }
    });
  
    // Retire la classe quand la modal se ferme
    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('modal-backdrop-blur');
    });
  }
}