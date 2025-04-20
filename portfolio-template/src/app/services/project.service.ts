import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { environment } from '../../environments/environment';
import { Project, ProjectResponse } from '../components/project-package/project.model';
import { ProjectTypeService } from './project-type.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiBaseUrl}/project`;

  constructor(
    private http: HttpClient, 
    private genericMethodeService : GenericMethodeService, 
    private projectTypeService : ProjectTypeService
) {}

  // Mettre à jour une expérience
  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-project/${id}`, project);
  }

  allProject(page : number = 0, size: number = 10) : Observable<Project[]>
  {
    return this.http.get<Project[]>(`${this.apiUrl}/all-project?page=${page}&size=${size}`);
  }

  experienceById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/get-project-by-id/${id}`);
  }

  // A modifie plutard

  createExperience(projectData: any): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  addProject(project: Project): Observable<Project> {
    
    const headers = this.genericMethodeService.getHeaders();
  
    console.log("🚀 Données envoyées au backend :", project);
  
    return this.http.post<Project>(`${this.apiUrl}/add-project`, project, { headers });
  }


    // Récupérer une expérience par ID
  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-project-by-id/${id}`);
  }

  // ✅ Version propre avec `switchMap()` pour éviter l'imbrication incorrecte des Observables
  getAllProject(page: number = 0, size: number = 10): Observable<ProjectResponse> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.get<ProjectResponse>(`${this.apiUrl}/all-project?page=${page}&size=${size}`,
      {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
      }
    ).pipe(
      switchMap(response => {
        const projectRequests = response.content.map(exp => {
          if (!exp.projectType && exp.projectTypeId) {
            return this.projectTypeService.getProjectTypeById(exp.projectTypeId).pipe(
              map(typeData => ({
                ...exp,
                projectType: { id: exp.projectTypeId, name: typeData.name }
              }))
            );
          }
          return new Observable<Project>(observer => {
            observer.next(exp);
            observer.complete();
          });
        });

        return forkJoin(projectRequests).pipe(
          map(updatedProject => ({
            ...response,
            content: updatedProject
          }))
        );
      })
    );
  }
  

    deleteProject(id: number): Observable<any> {

      const headers = this.genericMethodeService.getHeaders();
      
      return this.http.delete(`${this.apiUrl}/remove-project/${id}`, {
        headers,
        responseType: 'text' as 'json'
      });

    }


}
