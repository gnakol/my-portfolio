import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { experienceTypeService } from '../../../../services/experience_type.service';
import { ExperienceService } from '../../../../services/experience.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-experience-form',
  standalone: false,
  templateUrl: './add-experience.component.html',
  styleUrl: './add-experience.component.scss'
})
export class AddExperienceComponent implements OnInit {

  experienceForm: FormGroup;

  experienceTypes: any[] = [];

  accountId: number | null = null; // ✅ Stocker l'ID utilisateur

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private experienceTypeService: experienceTypeService,
    private experienceService: ExperienceService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      companyName: ['', Validators.required],
      experienceType: ['', Validators.required] // Sélection de l'ID
    });
  }

  ngOnInit(): void {
    this.loadExperienceTypes();

    this.loadUserId(); // ✅ Charger l'ID utilisateur dès le début
  }

  // ✅ Charger la liste des types d'expérience
  loadExperienceTypes(): void {
    this.experienceTypeService.getAllExperienceTypes().subscribe({
      next: (data) => {
        this.experienceTypes = data.content || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types d\'expérience :', error);
        this.snackBar.open('Impossible de charger les types d\'expériences.', 'Fermer', { duration: 3000 });
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
            console.log("✅ ID utilisateur chargé :", this.accountId);
          },
          error: (error) => {
            console.error("❌ Erreur récupération ID utilisateur :", error);
            this.accountId = null;
          }
        });
      }
    }

  // ✅ Soumettre le formulaire
  onSubmit(): void {
    if (this.experienceForm.valid && this.accountId) {
      const experienceData = {
        ...this.experienceForm.value,
        experienceType_id: this.experienceForm.value.experienceType, // ✅ On envoie l'ID du type d'expérience
        account_id: this.accountId // ✅ On ajoute l'ID utilisateur
      };

      this.experienceService.addExperience(experienceData).subscribe({
        next: () => {
          this.snackBar.open('Expérience enregistrée avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/experiences']); // ✅ Redirection après ajout
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'enregistrement de l\'expérience.', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
  }
}