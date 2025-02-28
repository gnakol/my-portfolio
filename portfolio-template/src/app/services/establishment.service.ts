import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Establishment } from '../components/establishment-package/establishment.model';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  private establishmentUrl = 'http://localhost:9000/portfolio-api/establishment'; // 🔥 Nouveau

  constructor(private http: HttpClient) {}

  allLEstablishment(page: number = 0, size: number = 10): Observable<{ content: Establishment[] }> {
    return this.http.get<{ content: Establishment[] }>(`${this.establishmentById}/all-establishment?page=${page}&size=${size}`);
  }

  establishmentById(id: number): Observable<Establishment> {
    return this.http.get<Establishment>(`${this.establishmentById}/get-by-id-training/${id}`);
  }

  getEstablishmentById(id: number): Observable<{ id: number; name: string; city: string }> {
    return this.http.get<{ id: number; name: string; city: string }>(`${this.establishmentUrl}/get-by-id-establishment/${id}`);
  }

  getAllEstablishments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.establishmentUrl}/all-establishment`);
  }
}
