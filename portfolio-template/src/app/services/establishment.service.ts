import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Establishment, EstablishmentResponse } from '../components/establishment-package/establishment.model';
import { GenericMethodeService } from './generic-methode.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  private establishmentUrl = `${environment.apiBaseUrl}/establishment`; // 🔥 Nouveau

  constructor(private http: HttpClient, private genericMethodeService : GenericMethodeService) {}

  getAllEstablishment(page: number = 0, size: number = 10): Observable<EstablishmentResponse> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.get<EstablishmentResponse>(`${this.establishmentUrl}/all-establishment?page=${page}&size=${size}`, { headers });
  }

  establishmentById(id: number): Observable<Establishment> {
    
    //const headers = this.genericMethodeService.getHeaders(); // ✅ Ajout des headers

    return this.http.get<Establishment>(
      `${this.establishmentUrl}/get-by-id-establishment/${id}`
    );
  }

  getEstablishmentById(id: number): Observable<{ id: number; name: string; city: string }> {
    //const headers = this.genericMethodeService.getHeaders(); // ✅ Ajout des headers

    return this.http.get<{ id: number; name: string; city: string }>(
        `${this.establishmentUrl}/get-by-id-establishment/${id}`
    );
}



  getAllEstablishments(): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.establishmentUrl}/all-establishment`);
  }

  deleteEstablishment(id: number): Observable<string> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.delete(`${this.establishmentUrl}/remove-establishment/${id}`, {
      headers,
      responseType: 'text' // 🔥 Spécifier que la réponse est de type texte
    });
  }

  addEstablishment(establishment: any): Observable<any> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.post(`${this.establishmentUrl}/add-establishment`, establishment, { headers });
  }
}
