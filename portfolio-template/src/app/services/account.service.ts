import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { Account } from '../components/account-package/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountUrl = `${environment.apiBaseUrl}/account`;

  constructor(private http: HttpClient, private genericMethode: GenericMethodeService) {}

  getAccountById(userId: number): Observable<Account> {
    const headers = this.genericMethode.getHeaders();
    return this.http.get<Account>(`${this.accountUrl}/get-by-id-account/${userId}`, { headers });
  }

  getAccountIdByEmail(email: string): Observable<number> {
    const headers = this.genericMethode.getHeaders();
    return this.http.get<number>(`${this.accountUrl}/get-account-id-by-email?email=${email}`, { headers });
  }
}
