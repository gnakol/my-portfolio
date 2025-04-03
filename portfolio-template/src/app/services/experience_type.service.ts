import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { ExperienceTypeResponse } from '../components/experiences-package/experience-type.model';

@Injectable({
  providedIn: 'root'
})
export class experienceTypeService {
  private experienceTypeUrl = 'http://localhost:9000/portfolio-api/experience-type';

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getExperienceTypeById(id: number): Observable<{ idExperienceType: number; name: string }> {
  
    return this.http.get<{ idExperienceType: number; name: string }>(
      `${this.experienceTypeUrl}/get-by-id-experience-type/${id}`
    );
  }
  

  getAllExperienceTypes(page: number = 0, size: number = 10): Observable<ExperienceTypeResponse> {

    //const headers = this.genericMethodeService.getHeaders();

    return this.http.get<ExperienceTypeResponse>(`${this.experienceTypeUrl}/all-experience-type?page=${page}&size=${size}`);
  }

  addExperienceType(experienceType: any): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.post(`${this.experienceTypeUrl}/add-experience-type`, experienceType, { headers });
  }

  deleteExperienceType(id: number): Observable<string> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete(`${this.experienceTypeUrl}/remove-experience-type/${id}`, {
      headers,
      responseType: 'text' // 🔥 Spécifier que la réponse est de type texte
    });
  } 
}