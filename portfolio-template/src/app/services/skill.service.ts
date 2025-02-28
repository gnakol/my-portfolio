import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../components/skill-package/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'http://localhost:9000/portfolio-api/skill';

  constructor(private http: HttpClient) {}

  allSkill(page: number = 0, size: number = 10): Observable<{ content: Skill[] }> {
    return this.http.get<{ content: Skill[] }>(`${this.apiUrl}/all-skill?page=${page}&size=${size}`);
  }

  skillById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/get-by-id-skill/${id}`);
  }

  createSkill(skillData: any): Observable<any> {
    return this.http.post(this.apiUrl, skillData);
  }
  
}
