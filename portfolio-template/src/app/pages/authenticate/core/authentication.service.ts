import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl = 'http://localhost:9000/portfolio-api/connexion';

  private readonly disconnectUrl = 'http://localhost:9000/portfolio-api/disconnect';

  private readonly tokenUrl = 'http://localhost:9000/portfolio-api/token';



  constructor(private http : HttpClient, private router : Router) { }


  login(username: string, password: string): Observable<string> {
    const body = { username, password };
    return this.http.post<{ bearer: string }>(this.authUrl, body)
      .pipe(
        map(response => {
          console.log('API Response:', response);
          if (response && response.bearer) {
            localStorage.setItem('jwtToken', response.bearer);
            this.router.navigate(['/dashboard']);  // Redirige vers le tableau de bord après la connexion
            return response.bearer;
          } else {
            throw new Error('Invalid response from server');
          }
        })
      );
  }

  logout(): void {
    const token = this.getToken();

    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<{ message: string }>(this.disconnectUrl, {}, { headers }).pipe(
      catchError(error => {
        console.error('Error during disconnect:', error);
        return of(null); // Return a default value to complete the observable
      })
    ).subscribe(response => {
      if (response !== null) {
        console.log('Disconnected successfully');
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
      }
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
      console.log('Parsed JWT Payload:', JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
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
      return this.http.get<any>(`http://localhost:900/portfolio-api/account/get-user-id-by-email?email=${email}`, { headers })
        .pipe(
          map(response => response.userId)
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


}
