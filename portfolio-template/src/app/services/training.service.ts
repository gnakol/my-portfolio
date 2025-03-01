import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Training, TrainingResponse } from '../components/training-package/training.model';
import { GenericMethodeService } from './generic-methode.service';
import { EstablishmentService } from './establishment.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  
  private apiUrl = 'http://localhost:9000/portfolio-api/training';

  constructor(
    private http: HttpClient, 
    private genericMethodeService: GenericMethodeService, 
    private establishmentService: EstablishmentService
  ) {}

  /**
   * ✅ Récupère toutes les formations avec leur établissement associé
   */
  getAllTraining(page: number = 0, size: number = 10): Observable<TrainingResponse> {
    const headers = this.genericMethodeService.getHeaders();

    return this.http.get<TrainingResponse>(`${this.apiUrl}/all-training?page=${page}&size=${size}`, { headers }).pipe(
      switchMap(response => {
        const trainingRequests = response.content.map(training => {
          if (!training.establishment && training.establishment_id) {
            return this.establishmentService.getEstablishmentById(training.establishment_id).pipe(
              map(establishmentData => ({
                ...training,
                establishment: { 
                  id: training.establishment_id, 
                  name: establishmentData.name, 
                  city: establishmentData.city
                }
              }))
            );
          }
          return new Observable<Training>(observer => {
            observer.next(training);
            observer.complete();
          });
        });

        return forkJoin(trainingRequests).pipe(
          map(updatedTrainings => ({
            ...response,
            content: updatedTrainings
          }))
        );
      })
    );
  }

  /**
   * ✅ Récupère une formation par son ID
   */
  getTrainingById(id: number): Observable<Training> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<Training>(`${this.apiUrl}/get-by-id-training/${id}`, { headers });
  }

  /**
   * ✅ Crée une nouvelle formation
   */
  addTraining(training: Training): Observable<Training> {
    const headers = this.genericMethodeService.getHeaders();
    console.log("🚀 Données envoyées au backend :", training);
    return this.http.post<Training>(`${this.apiUrl}/add-training`, training, { headers });
  }

  /**
   * ✅ Met à jour une formation existante
   */
  updateTraining(id: number, training: any): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.put(`${this.apiUrl}/update-training/${id}`, training, { headers });
  }

  /**
   * ✅ Supprime une formation
   */
  deleteTraining(id: number): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete(`${this.apiUrl}/remove-training/${id}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }
}
