import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experience } from '../components/experiences-package/experience.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:9000/portfolio-api/experience'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les expériences (pagination incluse)
  getAllExperiences(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-experience?page=${page}&size=${size}`);
  }

  // Récupérer une expérience par ID
  getExperienceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-by-id-experience/${id}`);
  }

  // Ajouter une nouvelle expérience
  addExperience(experience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-experience`, experience);
  }

  // Mettre à jour une expérience
  updateExperience(id: number, experience: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-experience/${id}`, experience);
  }

  // Supprimer une expérience
  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-experience/${id}`);
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
}
