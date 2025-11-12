import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackDTO, PingRequest, PingResponse, SimulationRequest, SimulationResponse, VlanRequest, VlanResponse } from '../interface/simulation.model';
import { GenericMethodeService } from '../../../services/generic-methode.service';
import { environment } from '../../../../environments/environment';
import {
  StartSessionRequest,
  StartSessionResponse,
  SendCommandRequest,
  SendCommandResponse,
  FinishSessionResponse,
  SaveFeedbackRequest,
  SaveFeedbackResponse
} from '../../../models/simulation.models';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private readonly apiUrl = `${environment.apiBaseUrl}/simulation`;

  private readonly feedbackUrl = `${environment.apiBaseUrl}/feedback`;

  constructor(private http : HttpClient, private genericMethodeService : GenericMethodeService) { }

  executePing(ipAddress : string) : Observable<PingResponse>
  {
    const headers = this.genericMethodeService.getHeaders();

    const requestBody : PingRequest = { ipAddress };

    return this.http.post<PingResponse>(`${this.apiUrl}/ping`, requestBody, {headers});
  }

  configureVlan(vlanId: string, vlanName: string): Observable<VlanResponse> {

    const headers = this.genericMethodeService.getHeaders();

    const requestBody: VlanRequest = { vlanId, vlanName };

    return this.http.post<VlanResponse>(`${this.apiUrl}/vlan`, requestBody, { headers });
  }

    // ✅ Nouvelle méthode pour exécuter les commandes VLAN dans le terminal
    executeVlanCommand(command: string): Observable<PingResponse> {

      const headers = new HttpHeaders({
                  'Content-Type': 'application/json',
                  // Ne pas inclure d'Authorization header
              })

      const requestBody = { command };
  
      return this.http.post<PingResponse>(`${this.apiUrl}/vlan`, requestBody, { headers });
    }

    configureEigrp(processId: string, network: string, wildcard: string): Observable<SimulationResponse> {

      const headers = this.genericMethodeService.getHeaders();

      const requestBody: SimulationRequest = { processId, network, wildcard };

      return this.http.post<SimulationResponse>(`${this.apiUrl}/eigrp`, requestBody, { headers });
    }

    simulateEigrpConfiguration(request: { network: string, wildcard: string, processId: string }): Observable<SimulationResponse> {

      const headers = this.genericMethodeService.getHeaders();

      return this.http.post<SimulationResponse>(`${this.apiUrl}/eigrp`, request, {headers});

    }
    

    addFeedback(feedback: FeedbackDTO): Observable<FeedbackDTO> {

      //const headers = this.genericMethodeService.getHeaders();

      return this.http.post<FeedbackDTO>(`${this.feedbackUrl}/add-feedback`, feedback);
    }

    // ========== NOUVEAUX ENDPOINTS POUR SIMULATION PERSISTÉE ==========

    /**
     * Démarre une nouvelle session de simulation
     */
    startSession(request: StartSessionRequest): Observable<StartSessionResponse> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<StartSessionResponse>(`${this.apiUrl}/session/start`, request, { headers });
    }

    /**
     * Envoie une commande à la session active
     */
    sendCommand(sessionId: number, request: SendCommandRequest): Observable<SendCommandResponse> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<SendCommandResponse>(
        `${this.apiUrl}/session/${sessionId}/command`,
        request,
        { headers }
      );
    }

    /**
     * Termine la session et calcule le score
     */
    finishSession(sessionId: number): Observable<FinishSessionResponse> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<FinishSessionResponse>(
        `${this.apiUrl}/session/${sessionId}/finish`,
        {},
        { headers }
      );
    }

    /**
     * Enregistre le feedback pour une session
     */
    saveFeedback(sessionId: number, request: SaveFeedbackRequest): Observable<SaveFeedbackResponse> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<SaveFeedbackResponse>(
        `${this.apiUrl}/session/${sessionId}/feedback`,
        request,
        { headers }
      );
    }
}
