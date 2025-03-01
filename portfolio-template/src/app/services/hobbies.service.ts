import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hobbies } from '../components/hobbies-package/hobbies.model';
import { GenericMethodeService } from './generic-methode.service';

@Injectable({
  providedIn: 'root'
})
export class HobbiesService {

  private hobbiesUrl = 'http://localhost:9000/portfolio-api/hobbies';

  constructor(
    private http: HttpClient,
    private genericMethodeService: GenericMethodeService
  ) {}

  allHobbies(page: number = 0, size: number = 10): Observable<{ content: Hobbies[] }> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<{ content: Hobbies[] }>(`${this.hobbiesUrl}/all-hobbies?page=${page}&size=${size}`, { headers });
  }

  /**
   * ✅ Récupérer un centre d'intérêt par ID
   */
  hobbiesById(id: number): Observable<Hobbies> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<Hobbies>(`${this.hobbiesUrl}/get-by-id-hobbies/${id}`, { headers });
  }

  /**
   * ✅ Ajouter un nouveau centre d'intérêt
   */
  createHobby(hobbyData: any): Observable<any> {

    const headers = this.genericMethodeService.getHeaders();
    
    return this.http.post(`${this.hobbiesUrl}/add-hobbies`, hobbyData, { headers });
  }

  deleteHobby(id: number): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete(`${this.hobbiesUrl}/remove-hobbies/${id}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }
  
}
