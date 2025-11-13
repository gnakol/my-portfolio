import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SkillCategoryService } from '../../../../services/category_skill.service';
import { SkillService } from '../../../../services/skill.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-add-skill',
  imports : [
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent implements OnInit {

  skillForm: FormGroup;

  skillCategories: any[] = [];

  accountId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private skillCategoryService: SkillCategoryService,
    private skillService: SkillService,
    private router : Router,
    private accountService : AccountService
  ) {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      skillCategory_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSkillCategory();

    this.loadUserId(); // ✅ Charger l'ID utilisateur dès le début
  }

  // ✅ Charger la liste des catégories de compétences
  loadSkillCategory(): void {
    this.skillCategoryService.getAllSkillCategory().subscribe({
      next: (data) => {
        this.skillCategories = data.content || [];
      },
      error: (error) => {
        // console.error('Erreur lors du chargement des catégories de compétences :', error);
        this.snackBar.open('Impossible de charger les catégories de compétences.', 'Fermer', { duration: 3000 });
      }
    });
  }

    // ✅ Charger l'ID utilisateur depuis le token
    loadUserId(): void {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.sub;
  
        this.accountService.getAccountIdByEmail(email).subscribe({
          next: (userId) => {
            this.accountId = userId;
            // console.log("✅ ID utilisateur chargé :", this.accountId);
          },
          error: (error) => {
            // console.error("❌ Erreur récupération ID utilisateur :", error);
            this.accountId = null;
          }
        });
      }
    }

  // ✅ Soumettre le formulaire
  onSubmit(): void {
    if (this.skillForm.valid && this.accountId) {
      const experienceData = {
        ...this.skillForm.value,
        experienceType_id: this.skillForm.value.experienceType, // ✅ On envoie l'ID à la catégorie de compétences
        account_id: this.accountId // ✅ On ajoute l'ID utilisateur
      };

      this.skillService.addSkill(experienceData).subscribe({
        next: () => {
          this.snackBar.open('Compétence enregistrée avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/skills']); // ✅ Redirection après ajout
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'enregistrement de la compétence.', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
  }
}