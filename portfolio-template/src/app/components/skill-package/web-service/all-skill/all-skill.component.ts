// all-skill.component.ts
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SkillService } from '../../../../services/skill.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UpdateSkillComponent } from '../update-skill/update-skill.component';

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
    ]),
    trigger('categoryPulse', [
      transition('* => *', [
        animate('3s', style({ 'box-shadow': '0 0 0 0 rgba(var(--category-rgb), 0.7)' })),
        animate('3s', style({ 'box-shadow': '0 0 0 20px rgba(var(--category-rgb), 0)' }))
      ])
    ])
  ]
})
export class AllSkillComponent implements OnInit {
  skills: any[] = [];
  loading = true;
  currentCategoryId?: number;
  currentCategoryName?: string;

  constructor(
    private skillService: SkillService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentCategoryId = params.get('id') ? Number(params.get('id')) : undefined;
      this.loadSkills();
    });
  }

  loadSkills(): void {
    const observable = this.currentCategoryId 
      ? this.skillService.getSkillsByCategory(this.currentCategoryId)
      : this.skillService.getAllSkill();

    observable.subscribe({
      next: (data) => {
        this.skills = data.content || [];
        if (this.currentCategoryId && this.skills.length > 0) {
          this.currentCategoryName = this.skills[0]?.skillCategory?.name;
        }
        this.loading = false;
      },
      error: (error) => {
        //console.error('Erreur lors du chargement des compétences :', error);
        this.snackBar.open('Impossible de charger les compétences.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getCategoryColor(categoryName: string | undefined): string {
    if (!categoryName) return '#6366f1';
    
    const colors: Record<string, string> = {
      'Développement': '#6366f1',
      'Réseau': '#3b82f6',
      'SECURITE': '#ec4899',
      'Systèmes Linux': '#10b981',
      'Virtualisation': '#f59e0b',
      'DevOps': '#8b5cf6',
      'Bases de données': '#14b8a6',
      'ADMINISTRATION SYSTEMES': '#64748b',
      'LOGISTIQUE': '#f97316'
    };

    return colors[categoryName] || '#8b5cf6';
  }

  getCategoryRgb(color: string): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  getSkillIcon(skillName: string): string {
    const icons: Record<string, string> = {
      'Java': 'code',
      'Spring': 'spring',
      'Angular': 'angular',
      'Réseau': 'settings_ethernet',
      'SECURITE': 'security',
      'Cisco': 'router',
      'Linux': 'terminal',
      'Docker': 'docker',
      'Cloud': 'cloud',
      'API': 'api',
      'SQL': 'storage',
      'Python': 'data_object',
      'JavaScript': 'javascript',
      'React': 'react',
      'Node.js': 'nodejs',
      'Git': 'git',
      'Kubernetes': 'kubernetes',
      'Azure': 'azure',
      'AWS': 'aws'
    };

    for (const key in icons) {
      if (skillName.toLowerCase().includes(key.toLowerCase())) {
        return icons[key];
      }
    }
    return 'star';
  }

  deleteSkill(id: number): void {
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.snackBar.open('Compétence supprimée avec succès !', 'Fermer', { duration: 3000 });
        this.skills = this.skills.filter(skill => skill.idSkill !== id);
      },
      error: (error) => {
        //console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  navigateToTemplate(): void {
    this.router.navigate(['/skill-template']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  viewSkill(skill: any): void {
    document.body.classList.add('modal-backdrop-blur');
    
    const dialogRef = this.dialog.open(SkillDetailComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'skill-modal',
      backdropClass: 'skill-modal-backdrop',
      data: { skill }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('modal-backdrop-blur');
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  editSkill(skill: any): void {
  document.body.classList.add('modal-backdrop-blur');
  
  const dialogRef = this.dialog.open(UpdateSkillComponent, {
    width: '800px',
    maxWidth: '90vw',
    panelClass: 'skill-modal',
    backdropClass: 'skill-modal-backdrop',
    data: { 
      skill: skill,
      onUpdate: () => this.loadSkills() // Pour recharger après update
    }
  });

  dialogRef.afterClosed().subscribe(() => {
    document.body.classList.remove('modal-backdrop-blur');
  });
}
}