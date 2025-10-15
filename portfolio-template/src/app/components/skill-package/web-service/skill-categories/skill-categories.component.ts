// skill-categories.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SkillCategoryService } from '../../../../services/category_skill.service';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-skill-categories',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSpinner],
  templateUrl: './skill-categories.component.html',
  styleUrls: ['./skill-categories.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SkillCategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;

  constructor(
    private categoryService: SkillCategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllSkillCategory().subscribe({
      next: (data) => {
        this.categories = data.content || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.snackBar.open('Impossible de charger les catégories', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getCategoryColor(categoryName: string): string {
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
    return colors[categoryName] || '#6366f1';
  }

  getCategoryIcon(categoryName: string): string {
    const icons: Record<string, string> = {
      'Développement': 'code',
      'Réseau': 'settings_ethernet',
      'SECURITE': 'security',
      'Systèmes Linux': 'terminal',
      'Virtualisation': 'cloud',
      'DevOps': 'settings',
      'Bases de données': 'storage',
      'ADMINISTRATION SYSTEMES': 'admin_panel_settings',
      'LOGISTIQUE': 'inventory'
    };
    return icons[categoryName] || 'category';
  }

// Modifie la méthode navigateToSkills (version ABSOLUE vers /cv)
navigateToSkills(categoryId: number): void {
  this.router.navigate(['/cv/skills/category', categoryId]);
}

navigateTo(route: string): void {
  this.router.navigate([route]);
}
}