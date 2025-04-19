import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ccna-roadmap',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="roadmap-container">
      <div class="roadmap-header">
        <h2>Mon Parcours CCNA <span class="lab-badge">LAB PHYSIQUE</span></h2>
        <button mat-icon-button (click)="dialogRef.close()" matTooltip="Fermer">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="roadmap-content">
        <div class="lab-description">
          <mat-icon>dns</mat-icon>
          <p>
            <strong>Mon Lab Physique :</strong> Cisco Catalyst 2960-X, Routeur 2901 Voice, 
            Raspberry Pi 5 (Serveur Ubuntu), TP-Link, 3 PCs multi-OS, câbles professionnels
          </p>
        </div>

        <div class="roadmap-timeline">
          <div class="timeline-item" *ngFor="let item of roadmapItems">
            <div class="timeline-marker">
              <mat-icon [class.completed]="item.completed">{{ item.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
            </div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              
              <div class="timeline-implementation" *ngIf="item.labImplementation">
                <mat-icon>dns</mat-icon>
                <span>Implémentation Lab: <strong>{{ item.labImplementation }}</strong></span>
              </div>
              
              <div class="timeline-date">
                <mat-icon>schedule</mat-icon>
                {{ item.date }}
                <span class="badge" *ngIf="item.current">EN COURS</span>
                <span class="badge badge-lab" *ngIf="item.labDone">LAB OK</span>
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
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
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
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .lab-badge {
        font-size: 0.7rem;
        background: rgba(236, 72, 153, 0.2);
        color: #ec4899;
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        font-weight: 600;
        animation: pulse 2s infinite;
      }
    }
    
    .lab-description {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(15, 23, 42, 0.5);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 3px solid #3b82f6;
      
      mat-icon {
        color: #3b82f6;
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
      
      p {
        margin: 0;
        font-size: 0.95rem;
        color: #e2e8f0;
        
        strong {
          color: #f8fafc;
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
    
    .timeline-implementation {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #a5b4fc;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 4px;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
      
      strong {
        color: #c7d2fe;
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
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        margin-left: 0.8rem;
        
        &-lab {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
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
      title: 'Fondamentaux réseaux',
      description: 'Modèles OSI/TCP-IP, sous-réseaux, VLAN basique',
      labImplementation: 'Packet Tracer',
      date: 'Novembre 2024',
      completed: true,
      labDone: true,
      resources: [
        { name: 'NetAcad', url: 'https://www.netacad.com' },
        { name: 'RFC 1180', url: 'https://tools.ietf.org/html/rfc1180' }
      ]
    },
    {
      title: 'Routage Inter-VLAN',
      description: 'Configuration de trunk (802.1Q), Router-on-a-Stick',
      labImplementation: 'Lab Physique (Routeur Cisco 2901 + Switch 2960-X)',
      date: 'Janvier 2025',
      completed: true,
      labDone: true
    },
    {
      title: 'Protocoles dynamiques',
      description: 'OSPF, EIGRP, redistribution de routes',
      labImplementation: 'Lab Physique avec 2 routeurs Cisco + Switch',
      date: 'Janvier 2025',
      completed: true,
      labDone: true
    },
    {
      title: 'Sécurité réseau',
      description: 'ACL, NAT/PAT, Sécurisation des équipements (SSH, VPN)',
      labImplementation: 'Routeur Cisco + Firewall TP-Link + Serveur Ubuntu',
      date: 'Fevrier 2025',
      completed: true,
      labDone: true
    },
    {
      title: 'Services réseaux',
      description: 'DHCP Relais, DNS, NTP, QoS, Radius',
      labImplementation: 'Raspberry Pi 5 (Serveur Ubuntu) + Cisco 2901',
      date: 'Mars 2025',
      completed: true,
      labDone: true,
      current: true
    },
    {
      title: 'Automatisation',
      description: 'Python pour réseaux, Ansible, APIs Cisco',
      labImplementation: 'En cours - Scripts Python/Bash pour gestion du lab',
      date: 'Juin 2025',
      completed: false,
      labDone: false
    },
    {
      title: 'Préparation CCNA',
      description: 'Tests pratiques, examens blancs, revue complète',
      labImplementation: 'Lab complet + Simulations temps réel',
      date: 'Juillet 2025',
      completed: false,
      labDone: false
    }
  ];
}