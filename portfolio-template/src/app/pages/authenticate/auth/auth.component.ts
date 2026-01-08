import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'app-auth',
  standalone: false, // Assure-toi que ce n'est pas en mode standalone
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'] // Utilise styleUrls au lieu de styleUrl
})
export class AuthComponent {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService : AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      otpCode: ['', [Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, otpCode } = this.loginForm.value;

      this.authService.login(email, password, otpCode || undefined).subscribe(
        token => {
          //console.log('Connexion réussie, token reçu:', token);
          this.router.navigate(['/dashboard-admin']);
        },
        error => {
          //console.error('Erreur de connexion:', error);
          if (error.status === 401) {
            this.snackBar.open('Code OTP requis ou incorrect', 'Fermer', { duration: 5000 });
          } else {
            this.snackBar.open('Identifiants incorrects', 'Fermer', { duration: 3000 });
          }
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', { duration: 3000 });
    }
  }
}