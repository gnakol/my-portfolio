import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SkillService } from '../../../../services/skill.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Skill } from '../../skill.model';
import { SkillCategoryService } from '../../../../services/category_skill.service';

@Component({
  selector: 'app-all-skill',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
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
  skills: Skill[] = [];
  loading = true;

  constructor(
    private skillService: SkillService,
    private skillCategoryService: SkillCategoryService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.allSkill().subscribe({
      next: (data) => {
        this.skills = data.content;

        // 🔥 Boucle sur les compétences pour récupérer les catégories si elles ne sont pas déjà fournies
        this.skills.forEach((skill) => {
          if (skill.skillCategory_id) {
            this.skillCategoryService.getSkillCategoryById(skill.skillCategory_id).subscribe(category => {
              skill.skillCategory = category; // 🔥 Remplace l’ID par l’objet complet
            });
          } else {
            skill.skillCategory = { id: -1, name: 'Catégorie inconnue' };
          }
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des compétences :', err);
        this.loading = false;
      }
    });
  }
}
