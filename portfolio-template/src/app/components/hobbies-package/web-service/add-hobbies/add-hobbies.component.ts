import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HobbiesService } from '../../../../services/hobbies.service';
import { AccountService } from '../../../../services/account.service';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hobbies',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-hobbies.component.html',
  styleUrls: ['./add-hobbies.component.scss']
})
export class AddHobbiesComponent implements OnInit {

  hobbyForm: FormGroup;
  accountId: number | null = null; // ✅ Stocker l'ID utilisateur

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private hobbiesService: HobbiesService,
    private accountService: AccountService, // ✅ Service pour récupérer l'ID utilisateur
    private router : Router
  ) {
    this.hobbyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserId(); // ✅ Charger l'ID utilisateur dès le démarrage
  }

  /**
   * ✅ Charger l'ID utilisateur depuis le token JWT
   */
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

  /**
   * ✅ Soumettre le formulaire avec l'ID utilisateur
   */
  onSubmit(): void {
    if (this.hobbyForm.valid && this.accountId) {
      const hobbyData = { 
        ...this.hobbyForm.value, 
        account_id: this.accountId // ✅ Associer l'utilisateur courant
      };

      // console.log("🚀 Données envoyées :", hobbyData);

      this.hobbiesService.createHobby(hobbyData).subscribe({
        next: (response) => {
          // console.log("✅ Réponse API :", response);
          this.snackBar.open('Centre d\'intérêt enregistré avec succès !', 'Fermer', { duration: 3000 });
          this.hobbyForm.reset();
          this.router.navigate(['/hobbies']);

        },
        error: (error) => {
          // console.error("❌ Erreur lors de l'ajout :", error);
          this.snackBar.open('Erreur lors de l\'enregistrement du centre d\'intérêt.', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
  }
}
