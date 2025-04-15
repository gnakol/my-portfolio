import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ]
})
export class ChangePasswordModalComponent {
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notSame: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.accountService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.snackBar.open('Mot de passe changé avec succès!', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(
            err.error || 'Erreur lors du changement de mot de passe', 
            'Fermer', 
            { duration: 5000 }
          );
          this.loading = false;
        }
      });
    }
  }
}