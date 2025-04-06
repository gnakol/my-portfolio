import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackDTO, PingRequest, PingResponse, SimulationRequest, SimulationResponse, VlanRequest, VlanResponse } from '../interface/simulation.model';
import { GenericMethodeService } from '../../../services/generic-methode.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private readonly apiUrl = 'http://localhost:9000/portfolio-api/simulation';

  private readonly feedbackUrl = 'http://localhost:9000/portfolio-api/feedback';

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

      const headers = this.genericMethodeService.getHeaders();

      return this.http.post<FeedbackDTO>(`${this.feedbackUrl}/add-feedback`, feedback, {headers});
    }
}
