import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../core/authentication.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.validateTokenWithServer(token).pipe(
      map(response => {
        if (response.isValid) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // ⚠️ Ne redirige que sur 401 (token expiré / invalide)
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // console.warn('Erreur réseau / serveur détectée:', error.message);
        }
        return of(false);
      })
    );
  }
}
