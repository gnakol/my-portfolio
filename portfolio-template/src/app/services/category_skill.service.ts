import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillCategoryService {
  private skillCategoryUrl = 'http://localhost:9000/portfolio-api/skill-category';

  constructor(private http: HttpClient) {}

  getSkillCategoryById(id: number): Observable<{ id: number; name: string }> {
    return this.http.get<{ id: number; name: string }>(`${this.skillCategoryUrl}/get-by-id-skill-category/${id}`);
  }

  getAllSkillCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.skillCategoryUrl}/all-skill-category`);
  }
}
