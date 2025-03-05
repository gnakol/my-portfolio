// cv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CvDTO } from '../pages/cv/cv-dto.model';
import { GenericMethodeService } from './generic-methode.service';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  private cvUrl = 'http://localhost:9000/portfolio-api/cv';

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getCvData(): Observable<CvDTO> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.get<CvDTO>(`${this.cvUrl}/download`, {headers});
  }
  
}