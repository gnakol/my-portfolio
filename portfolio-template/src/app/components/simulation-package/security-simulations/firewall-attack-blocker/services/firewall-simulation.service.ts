import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SessionStartRequest,
  SessionStartResponse,
  FirewallRule,
  RuleExecutionResponse,
  SessionEndRequest,
  SessionResult,
  LeaderboardEntry
} from '../models/firewall.models';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirewallSimulationService {

  private readonly API_URL = `${environment.apiBaseUrl}/api/simulation/firewall`;

  constructor(private http: HttpClient) { }

  /**
   * Démarre une nouvelle session de simulation
   */
  startSession(request: SessionStartRequest): Observable<SessionStartResponse> {
    return this.http.post<SessionStartResponse>(`${this.API_URL}/start`, request);
  }

  /**
   * Exécute une règle firewall
   */
  executeRule(rule: FirewallRule): Observable<RuleExecutionResponse> {
    return this.http.post<RuleExecutionResponse>(`${this.API_URL}/execute-rule`, rule);
  }

  /**
   * Termine la session
   */
  endSession(request: SessionEndRequest): Observable<SessionResult> {
    return this.http.post<SessionResult>(`${this.API_URL}/end`, request);
  }

  /**
   * Récupère le classement
   */
  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.API_URL}/leaderboard`);
  }

  /**
   * Parse une commande utilisateur en FirewallRule
   */
  parseCommand(command: string, sessionUuid: string): FirewallRule | null {
    const cmd = command.trim().toLowerCase();

    // block ip <IP>
    const blockIpMatch = cmd.match(/^block\s+ip\s+(\d+\.\d+\.\d+\.\d+)$/);
    if (blockIpMatch) {
      return {
        sessionUuid,
        ruleCommand: command,
        ruleType: 'block',
        targetIp: blockIpMatch[1]
      };
    }

    // block proto=<tcp/udp> port=<PORT>
    const blockProtoPortMatch = cmd.match(/^block\s+proto=(\w+)\s+port=(\d+)$/);
    if (blockProtoPortMatch) {
      return {
        sessionUuid,
        ruleCommand: command,
        ruleType: 'block',
        protocol: blockProtoPortMatch[1],
        targetPort: parseInt(blockProtoPortMatch[2])
      };
    }

    // block port=<PORT>
    const blockPortMatch = cmd.match(/^block\s+port=(\d+)$/);
    if (blockPortMatch) {
      return {
        sessionUuid,
        ruleCommand: command,
        ruleType: 'block',
        targetPort: parseInt(blockPortMatch[1])
      };
    }

    // rate-limit http <RATE>/s
    const rateLimitMatch = cmd.match(/^rate-limit\s+http\s+(\d+)\/s$/);
    if (rateLimitMatch) {
      return {
        sessionUuid,
        ruleCommand: command,
        ruleType: 'rate-limit',
        protocol: 'http'
      };
    }

    // drop proto=<PROTOCOL> port=<PORT> size><SIZE>
    const dropMatch = cmd.match(/^drop\s+proto=(\w+)\s+port=(\d+)\s+size>(\d+)$/);
    if (dropMatch) {
      return {
        sessionUuid,
        ruleCommand: command,
        ruleType: 'drop',
        protocol: dropMatch[1],
        targetPort: parseInt(dropMatch[2])
      };
    }

    return null;
  }

  /**
   * Génère des suggestions de commandes
   */
  getCommandSuggestions(input: string): string[] {
    const suggestions = [
      'block ip 185.220.101.45',
      'block proto=tcp port=80',
      'block proto=tcp port=22',
      'block proto=udp port=53',
      'block port=3306',
      'rate-limit http 1000/s',
      'drop proto=udp port=53 size>512',
      'show attacks',
      'show threat-intel'
    ];

    if (!input) return suggestions;

    return suggestions.filter(s =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}
