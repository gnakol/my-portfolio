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
  skillCategories: any[] = []; // Liste des catégories de compétences

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private skillCategoryService: SkillCategoryService,
    private skillService: SkillService
  ) {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      skillCategory_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSkillCategories();
  }

  // Charger les catégories de compétences
  loadSkillCategories(): void {
    this.skillCategoryService.getAllSkillCategories().subscribe(
      (data) => {
        this.skillCategories = data;
      },
      (error) => {
        this.snackBar.open('Erreur lors du chargement des catégories de compétences.', 'Fermer', {
          duration: 3000,
        });
      }
    );
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.skillForm.valid) {
      const skillData = this.skillForm.value;
      this.skillService.createSkill(skillData).subscribe(
        (response) => {
          this.snackBar.open('Compétence enregistrée avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.skillForm.reset();
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'enregistrement de la compétence.', 'Fermer', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', {
        duration: 3000,
      });
    }
  }
}