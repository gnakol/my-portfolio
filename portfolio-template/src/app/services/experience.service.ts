import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Experience, ExperienceResponse } from '../components/experiences-package/experience.model';
import { GenericMethodeService } from './generic-methode.service';
import { AuthenticationService } from '../pages/authenticate/core/authentication.service';
import { experienceTypeService } from './experience_type.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = `${environment.apiBaseUrl}/experience`;

  constructor(
    private http: HttpClient, 
    private genericMethodeService : GenericMethodeService, 
    private authService : AuthenticationService,
    private experienceTypeService : experienceTypeService) {}

  // Mettre à jour une expérience
  updateExperience(id: number, experience: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-experience/${id}`, experience);
  }

  allExperience(page : number = 0, size: number = 10) : Observable<Experience[]>
  {
    return this.http.get<Experience[]>(`${this.apiUrl}/all-experience?page=${page}&size=${size}`);
  }

  experienceById(id: number): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/get-by-id-experience/${id}`);
  }

  // A modifie plutard

  createExperience(experienceData: any): Observable<any> {
    return this.http.post(this.apiUrl, experienceData);
  }

  addExperience(experience: Experience): Observable<Experience> {
    
    const headers = this.genericMethodeService.getHeaders();
  
    console.log("🚀 Données envoyées au backend :", experience);
  
    return this.http.post<Experience>(`${this.apiUrl}/add-experience`, experience, { headers });
  }


    // Récupérer une expérience par ID
  getExperienceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-by-id-experience/${id}`);
  }

  // ✅ Version propre avec `switchMap()` pour éviter l'imbrication incorrecte des Observables
  getAllExperiences(page: number = 0, size: number = 10): Observable<ExperienceResponse> {

    return this.http.get<ExperienceResponse>(`${this.apiUrl}/all-experience?page=${page}&size=${size}`).pipe(
      switchMap(response => {
        const experienceRequests = response.content.map(exp => {
          if (!exp.experienceType && exp.experienceType_id) {
            return this.experienceTypeService.getExperienceTypeById(exp.experienceType_id).pipe(
              map(typeData => ({
                ...exp,
                experienceType: { id: exp.experienceType_id, name: typeData.name }
              }))
            );
          }
          return new Observable<Experience>(observer => {
            observer.next(exp);
            observer.complete();
          });
        });

        return forkJoin(experienceRequests).pipe(
          map(updatedExperiences => ({
            ...response,
            content: updatedExperiences
          }))
        );
      })
    );
  }
  

    // ✅ Supprimer une expérience
    deleteExperience(id: number): Observable<any> {

      const headers = this.genericMethodeService.getHeaders();
      
      return this.http.delete(`${this.apiUrl}/remove-experience/${id}`, {
        headers,
        responseType: 'text' as 'json'
      });

    }


}
