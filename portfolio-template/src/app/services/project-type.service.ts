import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { environment } from '../../environments/environment';
import { ProjectTypeTypeResponse } from '../components/project-package/project-type.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  private projectTypeUrl = `${environment.apiBaseUrl}/project-type`;

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getProjectTypeById(id: number): Observable<{ idProjectType: number; name: string }> {

    const headers = this.genericMethodeService.getHeaders();
  
    return this.http.get<{ idProjectType: number; name: string }>(
      `${this.projectTypeUrl}/get-project-type-by-id/${id}`,
      {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    }
    );
  }
  

  getAllProjectTypes(page: number = 0, size: number = 10): Observable<ProjectTypeTypeResponse> {

    //const headers = this.genericMethodeService.getHeaders();

    return this.http.get<ProjectTypeTypeResponse>(`${this.projectTypeUrl}/all-project-type?page=${page}&size=${size}`);
  }

  addProjectType(projectType: any): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.post(`${this.projectTypeUrl}/add-project-type`, projectType, { headers });
  }

  deleteProjectType(id: number): Observable<string> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete(`${this.projectTypeUrl}/remove-project-type/${id}`, {
      headers,
      responseType: 'text' 
    });
  } 
}