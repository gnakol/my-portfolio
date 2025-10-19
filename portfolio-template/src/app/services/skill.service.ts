import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Skill, SkillResponse } from '../components/skill-package/skill.model';
import { GenericMethodeService } from './generic-methode.service';
import { SkillCategoryService } from './category_skill.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = `${environment.apiBaseUrl}/skill`;

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


    addSkill(skill: Skill): Observable<Skill> {
      
      const headers = this.genericMethodeService.getHeaders();
    
      return this.http.post<Skill>(`${this.apiUrl}/add-skill`, skill, { headers });
    }

    updateSkill(id: number, skillData: any): Observable<Skill> {

      const headers = this.genericMethodeService.getHeaders();

      return this.http.put<Skill>(`${this.apiUrl}/update-skill/${id}`, skillData, { headers });
    }
  
  
    getSkillById(id: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/get-by-id-skill/${id}`);
    }
  
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

      // Dans skill.service.ts
getSkillsByCategory(categoryId: number, page: number = 0, size: number = 10): Observable<SkillResponse> {
  
  return this.http.get<SkillResponse>(`${this.apiUrl}/by-category/${categoryId}?page=${page}&size=${size}`,
    {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
      })
  }
  ).pipe(
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
    }), 
  );
}
  
}
