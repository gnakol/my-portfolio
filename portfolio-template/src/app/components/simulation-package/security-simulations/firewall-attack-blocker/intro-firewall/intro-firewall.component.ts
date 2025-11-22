import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intro-firewall',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './intro-firewall.component.html',
  styleUrls: ['./intro-firewall.component.scss']
})
export class IntroFirewallComponent {

  @Output() startSimulation = new EventEmitter<string>();

  playerPseudo: string = '';
  showPseudoInput: boolean = false;

  // Statistiques en temps réel
  stats = {
    totalSessions: 1247,
    activeNow: 12,
    avgScore: 3842,
    topScore: 8950
  };

  // Scénario contextuel
  scenario = {
    company: 'TechShop',
    date: 'Black Friday - 14h27',
    threat: '45 000 req/s',
    normal: '2 000 req/s',
    timeLimit: 60,
    moneyPerSecond: '5 000€'
  };

  // Features de la simulation
  features = [
    {
      icon: 'shield',
      title: 'DÉTECTION MULTI-VECTEURS',
      description: 'Identifiez simultanément DDoS HTTP, SYN Flood, DNS Amplification et attaques Botnet',
      color: 'cyber-blue'
    },
    {
      icon: 'terminal',
      title: 'COMMANDES RÉALISTES',
      description: 'Utilisez des commandes de firewall professionnelles (iptables-style)',
      color: 'cyber-purple'
    },
    {
      icon: 'trending_up',
      title: 'SCORING DYNAMIQUE',
      description: 'Gagnez des points en temps réel et sauvez du chiffre d\'affaires',
      color: 'cyber-green'
    },
    {
      icon: 'leaderboard',
      title: 'CLASSEMENT GLOBAL',
      description: 'Comparez vos performances avec d\'autres analystes SOC',
      color: 'cyber-red'
    }
  ];

  // Exemples de commandes
  commandExamples = [
    { cmd: 'block ip 185.220.101.45', desc: 'Bloquer une IP malveillante' },
    { cmd: 'block proto=tcp port=80', desc: 'Bloquer un port spécifique' },
    { cmd: 'rate-limit http 1000/s', desc: 'Limiter le taux de requêtes' },
    { cmd: 'show attacks', desc: 'Analyser les attaques actives' }
  ];

  onStart(): void {
    // Le pseudo est maintenant obligatoire (validation dans le template)
    if (!this.playerPseudo.trim()) {
      return;
    }

    const pseudo = this.playerPseudo.trim();
    this.startSimulation.emit(pseudo);
  }

  togglePseudoInput(): void {
    this.showPseudoInput = !this.showPseudoInput;
  }

  // Animation des stats (peut être amélioré avec RxJS)
  animateStats(): void {
    setInterval(() => {
      this.stats.activeNow = Math.floor(Math.random() * 20) + 5;
    }, 3000);
  }

  ngOnInit(): void {
    this.animateStats();
  }
}
