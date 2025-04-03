import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { GenericMethodeService } from '../../../services/generic-methode.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl = 'http://localhost:9000/portfolio-api/connexion';

  private readonly disconnectUrl = 'http://localhost:9000/portfolio-api/disconnect';

  private readonly tokenUrl = 'http://localhost:9000/portfolio-api/token';

  private readonly refreshTokenUrl = 'http://localhost:9000/portfolio-api/refresh-token';

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());



  constructor(
    private http : HttpClient, 
    private router : Router) { }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }


  login(username: string, password: string): Observable<string> {
    return this.http.post<{ bearer: string }>('http://localhost:9000/portfolio-api/connexion', { username, password })
      .pipe(
        map(response => {
          if (response?.bearer) {
            localStorage.setItem('jwtToken', response.bearer);
            this.authStatus.next(true);  // 🔥 Met à jour l’état d’authentification
            this.router.navigate(['/dashboard-admin']);
            return response.bearer;
          } else {
            throw new Error('Invalid response from server');
          }
        })
      );
  }

  logout(): void {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<{ message: string }>('http://localhost:9000/portfolio-api/disconnect', {}, { headers }).subscribe(() => {
      localStorage.removeItem('jwtToken');
      this.authStatus.next(false);  // 🔥 Met à jour l’état d’authentification
      this.router.navigate(['/login']);
    }, () => {
      localStorage.removeItem('jwtToken');
      this.authStatus.next(false);
      this.router.navigate(['/login']);
    });
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

        console.log('🔍 Je suis la méthode getUserIdFromToken : Email extrait du token :', email);

        return this.http.get<any>(`http://localhost:9000/portfolio-api/account/get-account-id-by-email?email=${email}`, { headers })
            .pipe(
                map(response => {
                    console.log('Je suis la méthode getUserIdFromToken ✅ ID utilisateur récupéré :', response);
                    return response.userId; // Vérifie que `userId` est bien renvoyé
                })
            );
    } else {
        throw new Error('User ID not found in token');
    }
}


  validateTokenWithServer(token: string): Observable<{ isValid: boolean }> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<{ isValid: boolean }>(`${this.tokenUrl}/validate-token`, { token }, { headers });
  }

  isAuthenticated() : boolean
  {
    return !!this.getToken();
  }

  refreshToken() : Observable<string>
  {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${token}`
    });

    return this.http.post<{ bearer : string }>(`${this.refreshTokenUrl}`, {}, {headers})
    .pipe(
      map(response => {
        if(response && response.bearer)
        {
          localStorage.setItem('jwtToken', response.bearer);
          return response.bearer;
        }
        else
        {
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
    console.log('Parsed Token:', parsedToken); // Debugging : affiche le contenu du token
  
    if (!parsedToken || !parsedToken.roles) return false;
  
    const isAdmin = parsedToken.roles.some((role: any) => role.name === 'ADMIN');
    console.log('Is Admin:', isAdmin); // Debugging : affiche si l'utilisateur est admin
    return isAdmin;
  }


}
