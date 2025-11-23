import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl = `${environment.apiBaseUrl}/connexion`;

  private readonly disconnectUrl = `${environment.apiBaseUrl}/disconnect`;

  private readonly tokenUrl = `${environment.apiBaseUrl}/token`;

  private readonly refreshTokenUrl = `${environment.apiBaseUrl}/refresh-token`;

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  private readonly accountUrl = `${environment.apiBaseUrl}/account`;



  constructor(
    private http : HttpClient, 
    private router : Router) { }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }


login(email: string, password: string): Observable<string> {
  return this.http.post<{
    access_token: string;
    refresh_token: string;
    expires_in: string;
  }>(this.authUrl, { email, password })
    .pipe(
      map(response => {
        if (response?.access_token) {
          // on stocke le token d’accès ET le refresh token
          localStorage.setItem('jwtToken', response.access_token);
          if (response.refresh_token) {
            localStorage.setItem('refreshToken', response.refresh_token);
          }

          this.authStatus.next(true);
          this.router.navigate(['/dashboard-admin']);
          return response.access_token;
        } else {
          throw new Error('Invalid response from server');
        }
      })
    );
}


logout(): void {
  const accessToken  = localStorage.getItem('jwtToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    // On nettoie quand même le localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
  });

  const body = { refresh_token: refreshToken };

  this.http.post<{ message: string }>(this.disconnectUrl, body, { headers })
    .subscribe(
      () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        this.authStatus.next(false);
        this.router.navigate(['/login']);
      },
      () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        this.authStatus.next(false);
        this.router.navigate(['/login']);
      }
    );
}


  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      //console.log('Parsed JWT Payload:', JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload);
    } catch (e) {
      //console.error('Error parsing JWT:', e);
      return null;
    }
  }

  getUserIdFromToken(): Observable<number> {
    const token = this.getToken();

    if (!token) {
        throw new Error('Token not found');
    }

    const parsedToken = this.parseJwt(token);

    if (parsedToken && parsedToken.sub) {
        const email = parsedToken.sub;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        //console.log('🔍 Je suis la méthode getUserIdFromToken : Email extrait du token :', email);

        return this.http.get<any>(`${this.accountUrl}/get-account-id-by-email?email=${email}`, { headers })
            .pipe(
                map(response => {
                    //console.log('Je suis la méthode getUserIdFromToken ✅ ID utilisateur récupéré :', response);
                    return response.userId; // Vérifie que `userId` est bien renvoyé
                })
            );
    } else {
        throw new Error('User ID not found in token');
    }
}


  // validateTokenWithServer(token: string): Observable<{ isValid: boolean }> {
    
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post<{ isValid: boolean }>(`${this.tokenUrl}/validate-token`, { token }, { headers });
  // }

  isAuthenticated() : boolean
  {
    return !!this.getToken();
  }

refreshToken(): Observable<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return throwError(() => new Error('No refresh token'));
  }

  return this.http.post<{
    access_token: string;
    refresh_token: string;
    expires_in: string;
  }>(this.refreshTokenUrl, { refresh_token: refreshToken })
    .pipe(
      map(response => {
        if (response?.access_token) {
          localStorage.setItem('jwtToken', response.access_token);
          if (response.refresh_token) {
            localStorage.setItem('refreshToken', response.refresh_token);
          }
          return response.access_token;
        } else {
          throw new Error('Failed to refresh token');
        }
      })
    );
}

  // Admin
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    const parsedToken = this.parseJwt(token);
    //console.log('Parsed Token:', parsedToken); 
  
    if (!parsedToken || !parsedToken.roles) return false;
  
    const isAdmin = parsedToken.roles.some((role: any) => role.name === 'ADMIN');
    return isAdmin;
  }


}
