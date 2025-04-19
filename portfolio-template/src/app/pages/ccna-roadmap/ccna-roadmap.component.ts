import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ccna-roadmap',
  imports : [
    CommonModule,
    MatIconModule,
    
  ],
  template: `
    <div class="roadmap-container">
      <div class="roadmap-header">
        <h2>Mon Parcours CCNA</h2>
        <button mat-icon-button (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="roadmap-content">
        <div class="roadmap-timeline">
          <div class="timeline-item" *ngFor="let item of roadmapItems">
            <div class="timeline-marker">
              <mat-icon [class.completed]="item.completed">{{ item.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
            </div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="timeline-date">
                <mat-icon>schedule</mat-icon>
                {{ item.date }}
                <span class="badge" *ngIf="item.current">EN COURS</span>
              </div>
              <div class="timeline-resources" *ngIf="item.resources">
                <mat-icon>link</mat-icon>
                <a *ngFor="let res of item.resources" [href]="res.url" target="_blank">{{ res.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roadmap-container {
      padding: 2rem;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .roadmap-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0;
        background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      button {
        color: #94a3b8;
        transition: all 0.3s ease;
        
        &:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    
    .roadmap-timeline {
      position: relative;
      padding-left: 2rem;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 24px;
        width: 2px;
        background: linear-gradient(to bottom, #10b981, #3b82f6);
      }
    }
    
    .timeline-item {
      display: flex;
      margin-bottom: 2rem;
      position: relative;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .timeline-marker {
      margin-right: 1.5rem;
      z-index: 2;
      
      mat-icon {
        font-size: 1.8rem;
        width: 1.8rem;
        height: 1.8rem;
        color: #64748b;
        transition: all 0.3s ease;
        
        &.completed {
          color: #10b981;
        }
      }
    }
    
    .timeline-content {
      flex: 1;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(59, 130, 246, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.2);
      }
      
      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #f8fafc;
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      
      p {
        font-size: 0.95rem;
        color: #94a3b8;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
    }
    
    .timeline-date {
      display: flex;
      align-items: center;
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 0.5rem;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
      }
      
      .badge {
        display: inline-block;
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        margin-left: 0.8rem;
        animation: pulse 2s infinite;
      }
    }
    
    .timeline-resources {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.85rem;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        color: #64748b;
        margin-right: 0.3rem;
      }
      
      a {
        color: #3b82f6;
        text-decoration: none;
        transition: all 0.3s ease;
        background: rgba(59, 130, 246, 0.1);
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        
        &:hover {
          background: rgba(59, 130, 246, 0.2);
        }
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `]
})
export class CCNARoadmapComponent {
  constructor(public dialogRef: MatDialogRef<CCNARoadmapComponent>) {}

  roadmapItems = [
    {
      title: 'Introduction aux réseaux',
      description: 'Comprendre les concepts de base des réseaux, modèles OSI et TCP/IP',
      date: 'Janvier 2023',
      completed: true,
      resources: [
        { name: 'Cisco Networking Academy', url: 'https://www.netacad.com' }
      ]
    },
    {
      title: 'Configuration matérielle Cisco',
      description: 'Mise en place du lab physique avec routeurs et switches Cisco',
      date: 'Février 2023',
      completed: true,
      resources: [
        { name: 'Packet Tracer', url: 'https://www.netacad.com/courses/packet-tracer' }
      ]
    },
    {
      title: 'Protocoles de routage',
      description: 'Maîtrise des protocoles OSPF, EIGRP et concepts de VLAN',
      date: 'Mars 2023',
      completed: true
    },
    {
      title: 'Sécurité réseau',
      description: 'ACL, NAT, Firewall et sécurisation des équipements',
      date: 'Avril 2023',
      completed: true
    },
    {
      title: 'Services IP',
      description: 'DHCP, DNS, NTP et QoS',
      date: 'Mai 2023',
      completed: false,
      current: true,
      resources: [
        { name: 'Lab GitHub', url: 'https://github.com' }
      ]
    },
    {
      title: 'Automatisation réseau',
      description: 'Introduction à Python pour les réseaux et outils d\'automatisation',
      date: 'Juin 2023',
      completed: false
    },
    {
      title: 'Préparation certification',
      description: 'Tests pratiques, revue complète et examen blanc',
      date: 'Juillet 2023',
      completed: false
    }
  ];
}