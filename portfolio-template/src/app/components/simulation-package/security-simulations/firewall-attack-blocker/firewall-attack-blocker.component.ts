import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroFirewallComponent } from './intro-firewall/intro-firewall.component';
import { SocDashboardComponent } from './soc-dashboard/soc-dashboard.component';
import { ResultsComponent } from './results/results.component';
import { SessionResult } from './models/firewall.models';

@Component({
  selector: 'app-firewall-attack-blocker',
  standalone: true,
  templateUrl: './firewall-attack-blocker.component.html',
  styleUrl: './firewall-attack-blocker.component.scss',
  imports: [
    CommonModule,
    IntroFirewallComponent,
    SocDashboardComponent,
    ResultsComponent
  ]
})
export class FirewallAttackBlockerComponent {

  currentView: 'intro' | 'dashboard' | 'results' = 'intro';
  playerPseudo: string = 'Anonymous';
  sessionResult?: SessionResult;

  /**
   * Démarre la simulation
   */
  onStartSimulation(pseudo: string): void {
    this.playerPseudo = pseudo;
    this.currentView = 'dashboard';
  }

  /**
   * Affiche les résultats
   */
  onSessionEnded(result: SessionResult): void {
    this.sessionResult = result;
    this.currentView = 'results';
  }

  /**
   * Recommence la simulation
   */
  onRestart(): void {
    this.sessionResult = undefined;
    this.currentView = 'dashboard';
  }

  /**
   * Retour à l'intro
   */
  onExit(): void {
    this.sessionResult = undefined;
    this.currentView = 'intro';
  }
}
