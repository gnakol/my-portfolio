import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkillCategory, SkillCategoryResponse } from '../../skill-category.model';
import { SkillCategoryService } from '../../../../services/category_skill.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-skill-category',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './all-skill-category.component.html',
  styleUrl: './all-skill-category.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class AllSkillCategoryComponent implements OnInit{

  skillCategory: SkillCategory[] = [];
  loading = true;

  constructor(private skillCategoryService: SkillCategoryService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadExperienceTypes();
  }

  loadExperienceTypes(): void {
    this.skillCategoryService.getAllSkillCategory().subscribe({
      next: (data: SkillCategoryResponse) => {
        this.skillCategory = data.content || []; 
        this.loading = false;
      },
      error: (err) => {
        //console.error('Erreur lors du chargement des types d’expériences :', err);
        this.loading = false;
      }
    });
  }

  deleteSkillDelete(id: number): void {
    this.skillCategoryService.deleteSkillCategory(id).subscribe({
      next: (response: string) => {
        //console.log('Réponse du backend :', response); // Afficher la réponse pour le débogage
        this.snackBar.open('La catégorie de compétence à été supprimé avec succès !', 'Fermer', { duration: 3000 });
  
        // 🔥 Retirer l'élément supprimé de la liste
        this.skillCategory = this.skillCategory.filter(type => type.idSkillCategory !== id);
      },
      error: (err) => {
        //console.error('Erreur lors de la suppression :', err); // Afficher l'erreur pour le débogage
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }



}
