import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../core/authentication.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService : AuthenticationService, private router : Router){}

  canActivate(): Observable<boolean> | boolean {

    const token = this.authService.getToken();

    if (token) 
      {

      return this.authService.validateTokenWithServer(token).pipe(
        map(response => {
          if (response.isValid) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(error => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
