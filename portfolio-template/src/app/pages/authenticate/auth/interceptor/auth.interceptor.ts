import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false; // Pour éviter plusieurs rafraîchissements simultanés

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Ajoute le token à la requête si disponible
    const token = this.authService.getToken();
    
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Si le token est expiré, on tente de le rafraîchir
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // On tente de rafraîchir le token
      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          this.isRefreshing = false;
          // On clone la requête originale avec le nouveau token
          const newRequest = this.addTokenToRequest(request, newToken);
          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // Si le rafraîchissement échoue, on déconnecte l'utilisateur
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(error);
        })
      );
    } else {
      // Si un rafraîchissement est déjà en cours, on attend
      return next.handle(request);
    }
  }
}