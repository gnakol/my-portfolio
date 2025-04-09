// cv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CvDTO } from '../pages/cv/cv-dto.model';
import { GenericMethodeService } from './generic-methode.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  private cvUrl = `${environment.apiBaseUrl}/cv`;

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getCvData(): Observable<CvDTO> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.get<CvDTO>(`${this.cvUrl}/download`, {headers});
  }
  
}