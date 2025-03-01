import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SkillService } from '../../../../services/skill.service';
import { CommonModule } from '@angular/common';
import { Skill } from '../../skill.model';
import { SkillCategoryService } from '../../../../services/category_skill.service';
import { ReactiveFormsModule } from '@angular/forms';


// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Ajouté pour MatSnackBar
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-all-skill',
  standalone: true,
  imports : [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule, // Ajouté ici
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatNativeDateModule
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
    private skillCategory : SkillCategoryService,
    private account : AccountService
  ) {}

  ngOnInit(): void {
    this.loadSkill();
  }

  loadSkill(): void {
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

  viewSkill(id: number): void {
    this.router.navigate(['/skill-detail', id]);
  }

  deleteSkill(id: number): void {
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.snackBar.open('Compétence supprimée avec succès !', 'Fermer', { duration: 3000 });
        
        // ✅ Mettre à jour la liste des compétences localement sans rechargement
        this.skills = this.skills.filter((skill) => skill.idSkill !== id);
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
}
