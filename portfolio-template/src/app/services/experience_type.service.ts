import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class experienceTypeService {
  private skillCategoryUrl = 'http://localhost:9000/portfolio-api/experience-type';

  constructor(private http: HttpClient) {}

  getExperienceTypeById(id: number): Observable<{ idExperienceType: number; name: string }> {
    return this.http.get<{ idExperienceType: number; name: string }>(`http://localhost:9000/portfolio-api/experience-type/get-by-id-experience-type/${id}`);
  }

  getAllExperienceTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.skillCategoryUrl);
  }
  
}