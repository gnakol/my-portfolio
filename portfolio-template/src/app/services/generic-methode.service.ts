import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../pages/authenticate/core/authentication.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenericMethodeService{

    constructor(private authService : AuthenticationService){}

    public getHeaders(contentType: 'json' | 'none' = 'json'): HttpHeaders {
      const token = this.authService.getToken();
    
      const headersConfig: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      };
    
      if (contentType === 'json') {
        headersConfig['Content-Type'] = 'application/json';
      }
    
      return new HttpHeaders(headersConfig);
    }
    
    

}