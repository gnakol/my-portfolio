import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkillService } from '../../../../services/skill.service';
import { SkillCategoryService } from '../../../../services/category_skill.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '../../../../services/account.service';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';

@Component({
  selector: 'app-update-skill',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './update-skill.component.html',
  styleUrls: ['./update-skill.component.scss']
})
export class UpdateSkillComponent implements OnInit {
  updateForm: FormGroup;
  categories: any[] = [];
  loading = false;
  saving = false;

  // 👉 nouvel état
  accountId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private categoryService: SkillCategoryService,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateSkillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      levelSkill: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      skillCategory_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserId();      // 👉 récupère l'ID account dès l’ouverture
    this.loadCategories();
    this.populateForm();
  }

  /** Décode proprement le payload JWT (base64url) */
  private decodeJwtPayload<T = any>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const json = atob(padded);
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  /** Récupère l'email depuis le token et résout l'ID compte via l’API */
  loadUserId(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.snackBar.open('Session expirée : reconnectez-vous.', 'Fermer', { duration: 3000 });
      return;
    }

    const payload = this.decodeJwtPayload<{ sub?: string }>(token);
    const email = payload?.sub; // le log serveur montre bien `sub = email`
    if (!email) {
      this.snackBar.open('Impossible de lire votre email dans le token.', 'Fermer', { duration: 3000 });
      return;
    }

    this.accountService.getAccountIdByEmail(email).subscribe({
      next: (id: number) => {
        this.accountId = id;
      },
      error: () => {
        this.snackBar.open('Impossible de récupérer votre compte.', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllSkillCategory(0, 100).subscribe({
      next: (response) => {
        this.categories = response.content || [];
        this.loading = false;
      },
      error: (error) => {
        // console.error('Erreur chargement catégories:', error);
        this.snackBar.open('Erreur lors du chargement des catégories', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  populateForm(): void {
    if (this.data.skill) {
      this.updateForm.patchValue({
        name: this.data.skill.name,
        description: this.data.skill.description,
        levelSkill: this.data.skill.levelSkill,
        skillCategory_id: this.data.skill.skillCategory_id
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.snackBar.open('Veuillez corriger les erreurs du formulaire', 'Fermer', { duration: 3000 });
      return;
    }
    if (this.accountId == null) {
      this.snackBar.open("Impossible d'envoyer la mise à jour : compte introuvable.", 'Fermer', { duration: 3000 });
      return;
    }

    this.saving = true;

    // 👉 on envoie bien account_id au backend
    const formData = {
      ...this.updateForm.value,
      account_id: this.accountId
    };

    this.skillService.updateSkill(this.data.skill.idSkill, formData).subscribe({
      next: (updatedSkill) => {
        this.snackBar.open('Compétence mise à jour avec succès !', 'Fermer', { duration: 3000 });
        this.saving = false;

        if (this.data.onUpdate) this.data.onUpdate();
        this.dialogRef.close(updatedSkill);
      },
      error: (error) => {
        // console.error('Erreur mise à jour:', error);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getLevelStars(level: number): string {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }
}
