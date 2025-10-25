// mission-control/services/web-socket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dashboard } from '../model/dashboard.model';
import { environment } from '../../../../environments/environment';
import SockJS from 'sockjs-client';
import { GenericMethodeService } from '../../../services/generic-methode.service';

interface Alert {
  type: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client | null = null;
  private connected = new BehaviorSubject<boolean>(false);
  private dashboardUpdates = new BehaviorSubject<Partial<Dashboard> | null>(null);
  private alerts = new BehaviorSubject<Alert | null>(null);

  constructor(
    private genericMethodeService : GenericMethodeService

  ) {}

  connect(): void {
    if (this.stompClient?.connected) {
      return;
    }

    // CORRECTION : URL SANS le /portfolio-api
    const wsUrl = `${environment.apiBaseUrl}/ws-mission-control`; 
    
    const socket = new SockJS(wsUrl);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg: string) => console.log('STOMP:', msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket CONNECTÉ avec succès:', frame);
      this.connected.next(true);

      // S'abonner aux updates du dashboard
      this.stompClient?.subscribe('/topic/dashboard-updates', (message: IMessage) => {
        try {
          const update = JSON.parse(message.body);
          console.log('📡 Update WebSocket reçu:', update);
          this.dashboardUpdates.next(update);
        } catch (e) {
          console.error('❌ Erreur parsing update:', e);
        }
      });

      // S'abonner aux alertes
      this.stompClient?.subscribe('/topic/alerts', (message: IMessage) => {
        try {
          const alert = JSON.parse(message.body);
          console.log('🚨 Alerte WebSocket reçue:', alert);
          this.alerts.next(alert);
          this.showAlertNotification(alert);
        } catch (e) {
          console.error('❌ Erreur parsing alert:', e);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur WebSocket:', frame);
      this.connected.next(false);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('❌ Erreur WebSocket native:', error);
      this.connected.next(false);
    };

    this.stompClient.onDisconnect = () => {
      console.log('🔌 WebSocket déconnecté');
      this.connected.next(false);
    };

    this.stompClient.activate();
    console.log('🔄 Activation WebSocket en cours...');
  }

  disconnect(): void {
    if (this.stompClient) {
      console.log('🔌 Déconnexion WebSocket manuelle');
      this.stompClient.deactivate();
      this.connected.next(false);
    }
  }

  // Observable pour les updates partiels
  get dashboardUpdates$(): Observable<Partial<Dashboard> | null> {
    return this.dashboardUpdates.asObservable();
  }

  // Observable pour les alertes
  get alerts$(): Observable<Alert | null> {
    return this.alerts.asObservable();
  }

  // Observable pour le statut de connexion
  get connected$(): Observable<boolean> {
    return this.connected.asObservable();
  }

  private showAlertNotification(alert: Alert): void {
    // Notification browser native
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 ${alert.level} - Mission Control`, {
        body: alert.message,
        icon: '/assets/logo.png'
      });
    }

    // Notification dans la console
    console.log(`🚨 ALERTE ${alert.level}: ${alert.message}`);
  }
}