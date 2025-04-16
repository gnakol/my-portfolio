import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../../services/project.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { ProjectTypeService } from '../../../../services/project-type.service';

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent implements OnInit {

  projectForm: FormGroup;
  projectTypes: any[] = [];
  accountId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private projectTypeService: ProjectTypeService,
    private projectService: ProjectService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      skillsDevelopment: [''],
      projectTypeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjectTypes();
    this.loadUserId();
  }

  loadProjectTypes(): void {
    this.projectTypeService.getAllProjectTypes().subscribe({
      next: (data) => {
        this.projectTypes = data.content || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de projet :', error);
        this.snackBar.open('Impossible de charger les types de projets.', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadUserId(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub;

      this.accountService.getAccountIdByEmail(email).subscribe({
        next: (userId) => {
          this.accountId = userId;
          console.log("✅ ID utilisateur chargé :", this.accountId);
        },
        error: (error) => {
          console.error("❌ Erreur récupération ID utilisateur :", error);
          this.accountId = null;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.accountId) {
      const formValue = this.projectForm.value;

      const projectData = {
        ...formValue,
        accountId: this.accountId
      };

      this.projectService.addProject(projectData).subscribe({
        next: () => {
          this.snackBar.open('Projet enregistré avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/projects']);
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'enregistrement.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}