import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hobbies } from '../components/hobbies-package/hobbies.model';

@Injectable({
  providedIn: 'root'
})
export class HobbiesService {

  private hobbiesUrl = 'http://localhost:9000/portfolio-api/hobbies';

  constructor(private http: HttpClient) {}

  allHobbies(page: number = 0, size: number = 10): Observable<{ content: Hobbies[] }> {
    return this.http.get<{ content: Hobbies[] }>(`${this.hobbiesUrl}/all-hobbies?page=${page}&size=${size}`);
  }

  hobbiesById(id: number): Observable<Hobbies> {
    return this.http.get<Hobbies>(`${this.hobbiesUrl}/get-by-id-hobbies/${id}`);
  }

  getHobbies(id: number): Observable<{ id: number; name: string; city: string }> {
    return this.http.get<{ id: number; name: string; city: string }>(`${this.hobbiesUrl}/get-by-id-hobbies/${id}`);
  }

  createHobby(hobbyData: any): Observable<any> {
    return this.http.post(this.hobbiesUrl, hobbyData);
  }
}
