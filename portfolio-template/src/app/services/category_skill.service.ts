import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { SkillCategoryResponse } from '../components/skill-package/skill-category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillCategoryService {
  private skillCategoryUrl = `${environment.apiBaseUrl}/skill-category`;

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getSkillCategoryById(id: number): Observable<{ idExperienceType: number; name: string }> {
    
    //const headers = this.genericMethodeService.getHeaders(); // ✅ Ajout du header
  
    return this.http.get<{ idExperienceType: number; name: string }>(`${this.skillCategoryUrl}/get-by-id-skill-category/${id}`);
  }
  

  getAllSkillCategory(page: number = 0, size: number = 10): Observable<SkillCategoryResponse> {

    //const headers = this.genericMethodeService.getHeaders();

    return this.http.get<SkillCategoryResponse>(`${this.skillCategoryUrl}/all-skill-category?page=${page}&size=${size}`);
  }

  addSkillCategory(skillCategory: any): Observable<any> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.post(`${this.skillCategoryUrl}/add-skill-category`, skillCategory, { headers });
  }

  deleteSkillCategory(id: number): Observable<string> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.delete(`${this.skillCategoryUrl}/remove-skill-category/${id}`, {
      headers,
      responseType: 'text' // 🔥 Spécifier que la réponse est de type texte
    });
  } 
}
