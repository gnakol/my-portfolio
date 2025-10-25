import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { Account } from '../components/account-package/account.model';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../pages/authenticate/core/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountUrl = `${environment.apiBaseUrl}/account`;

  constructor(
    private http: HttpClient, 
    private genericMethode: GenericMethodeService,
    private authService : AuthenticationService
  ) {}

  getAccountById(userId: number): Observable<Account> {
    const headers = this.genericMethode.getHeaders();
    return this.http.get<Account>(`${this.accountUrl}/get-by-id-account/${userId}`, { headers });
  }

  getAccountIdByEmail(email: string): Observable<number> {
    const headers = this.genericMethode.getHeaders();
    return this.http.get<number>(`${this.accountUrl}/get-account-id-by-email?email=${email}`, { headers });
  }

// account.service.ts
uploadProfileImage(userId: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  // Solution miracle pour les tokens avec FormData
  const req = new HttpRequest(
    'POST',
    `${this.accountUrl}/upload-profile-image/${userId}`,
    formData,
    {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    }
  );

  return this.http.request(req).pipe(
    filter(event => event instanceof HttpResponse),
    map((event: HttpResponse<any>) => event.body)
  );
}

// Ajoute cette méthode à AccountService
changePassword(oldPassword: string, newPassword: string): Observable<string> {
  const changePasswordDto = {
    olPassword: oldPassword,
    newPassword: newPassword
  };

  return this.http.put(
    `${this.accountUrl}/change-password`,
    changePasswordDto,
    {
      headers: this.genericMethode.getHeaders(),
      responseType: 'text'
    }
  );
}

uploadCv(userId: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  const req = new HttpRequest(
    'POST',
    `${this.accountUrl}/upload-cv/${userId}`,
    formData,
    {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    }
  );

  return this.http.request(req).pipe(
    filter(event => event instanceof HttpResponse),
    map((event: HttpResponse<any>) => event.body)
  );
}

getCvUrl(userId: number): Observable<string> {
  const headers = this.genericMethode.getHeaders();
  return this.http.get(`${this.accountUrl}/get-cv-url/${userId}`, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
  }),
    responseType: 'text'
  });
}


}
