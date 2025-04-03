import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkillService } from '../../../services/skill.service';
import { SkillCategoryService } from '../../../services/category_skill.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss'],
  imports : [
    CommonModule,
    MatCardModule,
    MatIconModule,

  ]
})
export class SkillDetailComponent implements OnInit {
  skill: any;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<SkillDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skillService: SkillService,
    private skillCategoryService: SkillCategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data.skill) {
      this.skill = this.data.skill;
      this.loading = false;
    } else if (this.data.id) {
      this.loadSkill(this.data.id);
    }
  }

  loadSkill(id: number): void {
    this.skillService.getSkillById(id).subscribe({
      next: (data) => {
        this.skill = data;
        if (this.skill.skillCategory_id && !this.skill.skillCategory) {
          this.loadCategory(this.skill.skillCategory_id);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading skill:', error);
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadCategory(id: number): void {
    this.skillCategoryService.getSkillCategoryById(id).subscribe({
      next: (category) => {
        this.skill.skillCategory = category;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.loading = false;
      }
    });
  }

  getCategoryColor(categoryName?: string): string {
    if (!categoryName) return '#6366f1';
    
    const colors: Record<string, string> = {
      'Développement': '#6366f1',
      'Réseaux': '#10b981',
      'Cybersécurité': '#ec4899',
      'Cloud': '#f59e0b',
      'DevOps': '#3b82f6'
    };

    return colors[categoryName] || '#6366f1';
  }

  getSkillIcon(skillName: string): string {
    const icons: Record<string, string> = {
      'Angular': 'code',
      'React': 'code',
      'Java': 'code',
      'Spring': 'code',
      'Docker': 'settings',
      'Kubernetes': 'settings',
      'AWS': 'cloud',
      'Azure': 'cloud',
      'Python': 'code',
      'JavaScript': 'code'
    };

    return icons[skillName] || 'star';
  }

  close(): void {
    this.dialogRef.close();
  }
}