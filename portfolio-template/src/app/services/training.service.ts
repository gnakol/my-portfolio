import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../components/training-package/training.model';
import { EstablishmentService } from './establishment.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = 'http://localhost:9000/portfolio-api/training';
  private establishmentUrl = 'http://localhost:9000/portfolio-api/establishment'; // 🔥 Nouveau

  constructor(private http: HttpClient, private establishment : EstablishmentService) {}

  allTraining(page: number = 0, size: number = 10): Observable<{ content: Training[] }> {
    return this.http.get<{ content: Training[] }>(`${this.apiUrl}/all-training?page=${page}&size=${size}`);
  }

  trainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/get-by-id-training/${id}`);
  }

  getEstablishmentById(id: number): Observable<{ id: number; name: string; city: string }> {
    return this.http.get<{ id: number; name: string; city: string }>(`${this.establishmentUrl}/get-by-id-establishment/${id}`);
  }
}
