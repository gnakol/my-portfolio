import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../pages/authenticate/core/authentication.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenericMethodeService{

    constructor(private authService : AuthenticationService){}

    public getHeaders(): HttpHeaders {

        const token = this.authService.getToken();

        if (!token) {
          throw new Error('No token found');
        }
        return new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
      }

}