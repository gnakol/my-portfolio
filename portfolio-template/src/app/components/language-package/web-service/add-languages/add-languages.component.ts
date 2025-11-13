import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from '../../../../services/language.service';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-add-languages',
  standalone: true,
  imports : [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatNativeDateModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-languages.component.html',
  styleUrls: ['./add-languages.component.scss']
})
export class AddLanguagesComponent implements OnInit {
  languageForm: FormGroup;
  accountId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    private accountService: AccountService,
    private router : Router
  ) {
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      proficiencyLevel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserId();
  }

  // Charger l'ID utilisateur depuis le token JWT
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

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.languageForm.valid && this.accountId) {
      const languageData = {
        ...this.languageForm.value,
        account_id: this.accountId
      };
      // console.log("🚀 Données envoyées :", languageData); 

      this.languageService.createLanguage(languageData).subscribe({
        next: () => {
          this.snackBar.open('Langue enregistrée avec succès !', 'Fermer', { duration: 3000 });
          this.languageForm.reset();
          this.router.navigate(['/languages']);
        },
        error: (error) => {
          // console.error("❌ Erreur lors de l'ajout :", error);
          this.snackBar.open('Erreur lors de l\'enregistrement de la langue.', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
  }
}
