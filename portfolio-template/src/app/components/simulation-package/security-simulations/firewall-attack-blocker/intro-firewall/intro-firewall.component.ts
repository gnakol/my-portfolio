import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro-firewall',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './intro-firewall.component.html',
  styleUrls: ['./intro-firewall.component.scss']
})
export class IntroFirewallComponent {

  @Output() startSimulation = new EventEmitter<void>();

  onStart()
  {
    this.startSimulation.emit();
  }

  // Configuration des éléments visuels
  connectors = Array(12).fill(0);
  
  legitPackets = Array(4).fill(0).map((_, i) => ({
    delay: `${i * 0.5}s`
  }));

  threatPackets = Array(3).fill(0).map((_, i) => ({
    delay: `${i * 0.7 + 0.2}s`
  }));

  features = [
    {
      icon: 'security',
      title: 'DÉTECTION EN TEMPS RÉEL',
      description: 'Identifiez et analysez les paquets réseau entrants pour détecter les menaces potentielles'
    },
    {
      icon: 'rule',
      title: 'CONFIGURATION DYNAMIQUE',
      description: 'Créez et modifiez des règles de firewall en direct pour bloquer les attaques'
    },
    {
      icon: 'analytics',
      title: 'VISUALISATION IMMÉDIATE',
      description: 'Observez l\'impact de vos règles sur le trafic réseau en temps réel'
    }
  ];
  
}