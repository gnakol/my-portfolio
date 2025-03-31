import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Skill, SkillResponse } from '../components/skill-package/skill.model';
import { GenericMethodeService } from './generic-methode.service';
import { SkillCategoryService } from './category_skill.service';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'http://localhost:9000/portfolio-api/skill';

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService, private skillCategoryService : SkillCategoryService) {}

  allSkill(page: number = 0, size: number = 10): Observable<{ content: Skill[] }> {
    return this.http.get<{ content: Skill[] }>(`${this.apiUrl}/all-skill?page=${page}&size=${size}`);
  }

  skillById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/get-by-id-skill/${id}`);
  }

  createSkill(skillData: any): Observable<any> {
    return this.http.post(this.apiUrl, skillData);
  }


    addSkill(experience: Skill): Observable<Skill> {
      
      const headers = this.genericMethodeService.getHeaders();
    
      console.log("🚀 Données envoyées au backend :", experience);
    
      return this.http.post<Skill>(`${this.apiUrl}/add-skill`, experience, { headers });
    }
  
  
      // Récupérer une expérience par ID
    getSkillById(id: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/get-by-id-skill/${id}`);
    }
  
    // ✅ Version propre avec `switchMap()` pour éviter l'imbrication incorrecte des Observables
    getAllSkill(page: number = 0, size: number = 10): Observable<SkillResponse> {

     // const headers = this.genericMethodeService.getHeaders();
  
      return this.http.get<SkillResponse>(`${this.apiUrl}/all-skill?page=${page}&size=${size}`).pipe(
        switchMap(response => {
          const skillRequests = response.content.map(exp => {
            if (!exp.skillCategory && exp.skillCategory_id) {
              return this.skillCategoryService.getSkillCategoryById(exp.skillCategory_id).pipe(
                map(typeData => ({
                  ...exp,
                  skillCategory: { id: exp.skillCategory_id, name: typeData.name }
                }))
              );
            }
            return new Observable<Skill>(observer => {
              observer.next(exp);
              observer.complete();
            });
          });
  
          return forkJoin(skillRequests).pipe(
            map(updatedExperiences => ({
              ...response,
              content: updatedExperiences
            }))
          );
        })
      );
    }
    
  
      // ✅ Supprimer une compétences
      deleteSkill(id: number): Observable<any> {
  
        const headers = this.genericMethodeService.getHeaders();
        return this.http.delete(`${this.apiUrl}/remove-skill/${id}`, {
          headers,
          responseType: 'text' as 'json'
        });
  
      }
  
}
