import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';
import { FirewallSimulationService } from '../services/firewall-simulation.service';
import {
  AttackEvent,
  GameState,
  SessionResult,
  FirewallRule
} from '../models/firewall.models';

@Component({
  selector: 'app-soc-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './soc-dashboard.component.html',
  styleUrls: ['./soc-dashboard.component.scss']
})
export class SocDashboardComponent implements OnInit, OnDestroy {

  @Input() playerPseudo: string = 'Anonymous';
  @Output() sessionEnded = new EventEmitter<SessionResult>();
  @ViewChild('trafficCanvas', { static: false }) trafficCanvas!: ElementRef<HTMLCanvasElement>;
  gameState: GameState = {
    sessionUuid: '',
    currentScore: 0,
    attacksBlocked: 0,
    totalAttacks: 0,
    rulesCreated: 0,
    timeRemaining: 60,
    isRunning: false,
    activeAttacks: []
  };

  // Terminal
  currentCommand: string = '';
  terminalLogs: string[] = [];
  commandHistory: string[] = [];
  historyIndex: number = -1;
  commandSuggestions: string[] = [];
  showSuggestions: boolean = false;

  // Stats visuelles
  moneySaved: number = 0;
  requestsPerSecond: number = 0;
  alertLevel: number = 0;

  // Subscriptions
  private timerSubscription?: Subscription;
  private trafficSubscription?: Subscription;

  // Canvas
  private canvasContext?: CanvasRenderingContext2D;
  private trafficData: number[] = new Array(60).fill(2000);

  constructor(private firewallService: FirewallSimulationService) {}

  ngOnInit(): void {
    this.initializeSimulation();
  }

  ngOnDestroy(): void {
    this.stopGame();
  }

  /**
   * Initialise la simulation
   */
  initializeSimulation(): void {
    this.addLog('🔵 Initializing SOC Dashboard...');
    this.addLog('📡 Connecting to SIEM...');

    setTimeout(() => {
      this.addLog('✅ Connected to Security Operations Center');
      this.addLog('⚠️  Type "show attacks" to see incoming threats');
      this.addLog('💡 Type "help" for available commands');
      this.startSession();
    }, 1000);
  }

  /**
   * Démarre la session backend
   */
  startSession(): void {
    this.firewallService.startSession({
      playerPseudo: this.playerPseudo
    }).subscribe({
      next: (response) => {
        this.gameState.sessionUuid = response.sessionUuid;
        this.gameState.activeAttacks = response.initialAttacks;
        this.gameState.totalAttacks = response.initialAttacks.length;

        this.addLog('');
        this.addLog('🚨 ALERT: Multiple attack vectors detected!');
        this.addLog(`📊 ${response.initialAttacks.length} threats identified`);
        this.addLog('⏱️  60 seconds to mitigate all threats');
        this.addLog('');

        this.startGame();
      },
      error: (err) => {
        this.addLog(`❌ Error starting session: ${err.message}`);
      }
    });
  }

  /**
   * Démarre le jeu (timer + traffic monitor)
   */
  startGame(): void {
    this.gameState.isRunning = true;

    // Timer countdown
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.gameState.timeRemaining > 0) {
        this.gameState.timeRemaining--;
        this.calculateMoneyLoss();
        this.updateAlertLevel();
      } else {
        this.endGame();
      }
    });

    // Traffic monitor updates
    this.trafficSubscription = interval(500).subscribe(() => {
      this.updateTrafficMonitor();
    });

    // Initialiser le canvas après un court délai
    setTimeout(() => {
      this.initCanvas();
    }, 100);
  }

  /**
   * Arrête le jeu
   */
  stopGame(): void {
    this.gameState.isRunning = false;
    this.timerSubscription?.unsubscribe();
    this.trafficSubscription?.unsubscribe();
  }

  /**
   * Termine la session
   */
  endGame(): void {
    this.stopGame();

    this.addLog('');
    this.addLog('⏰ TIME UP!');
    this.addLog(`🎯 Final Score: ${this.gameState.currentScore}`);
    this.addLog(`🛡️  Attacks Blocked: ${this.gameState.attacksBlocked}/${this.gameState.totalAttacks}`);
    this.addLog('');
    this.addLog('Saving results...');

    // Envoyer au backend
    this.firewallService.endSession({
      sessionUuid: this.gameState.sessionUuid,
      rating: undefined,
      feedback: undefined
    }).subscribe({
      next: (result) => {
        this.sessionEnded.emit(result);
      },
      error: (err) => {
        this.addLog(`❌ Error saving results: ${err.message}`);
      }
    });
  }

  /**
   * Exécute une commande
   */
  executeCommand(): void {
    if (!this.currentCommand.trim()) return;

    const cmd = this.currentCommand.trim();
    this.addLog(`root@firewall# ${cmd}`);
    this.commandHistory.push(cmd);
    this.historyIndex = this.commandHistory.length;

    // Commandes spéciales
    if (cmd.toLowerCase() === 'help') {
      this.showHelp();
    } else if (cmd.toLowerCase() === 'show attacks') {
      this.showAttacks();
    } else if (cmd.toLowerCase() === 'show threat-intel') {
      this.showThreatIntel();
    } else if (cmd.toLowerCase() === 'clear') {
      this.terminalLogs = [];
    } else if (cmd.toLowerCase().startsWith('block') ||
               cmd.toLowerCase().startsWith('rate-limit') ||
               cmd.toLowerCase().startsWith('drop')) {
      this.executeFirewallRule(cmd);
    } else {
      this.addLog(`❌ Unknown command: ${cmd}`);
      this.addLog('💡 Type "help" for available commands');
    }

    this.currentCommand = '';
    this.showSuggestions = false;
  }

  /**
   * Exécute une règle firewall
   */
  executeFirewallRule(command: string): void {
    const rule = this.firewallService.parseCommand(command, this.gameState.sessionUuid);

    if (!rule) {
      this.addLog(`❌ Invalid rule syntax`);
      this.addLog('Example: block ip 185.220.101.45');
      return;
    }

    this.firewallService.executeRule(rule).subscribe({
      next: (response) => {
        if (response.success) {
          this.addLog(`✅ ${response.message}`);
          this.gameState.currentScore = response.currentScore;
          this.gameState.attacksBlocked += response.attacksBlocked;
          this.gameState.rulesCreated++;

          // Marquer les attaques comme bloquées
          response.blockedAttackIds.forEach(id => {
            const attack = this.gameState.activeAttacks.find(a => a.id === id);
            if (attack) attack.isBlocked = true;
          });

          // Vérifier si toutes les attaques sont bloquées
          if (this.gameState.attacksBlocked >= this.gameState.totalAttacks) {
            this.addLog('');
            this.addLog('🎉 ALL THREATS NEUTRALIZED!');
            this.addLog('💎 PERFECT DEFENSE!');
            setTimeout(() => this.endGame(), 2000);
          }
        } else {
          this.addLog(`⚠️  ${response.message}`);
        }
      },
      error: (err) => {
        this.addLog(`❌ Error executing rule: ${err.message}`);
      }
    });
  }

  /**
   * Affiche l'aide
   */
  showHelp(): void {
    this.addLog('');
    this.addLog('=== AVAILABLE COMMANDS ===');
    this.addLog('block ip <IP>                    - Block specific IP address');
    this.addLog('block proto=<tcp/udp> port=<N>   - Block traffic by protocol and port');
    this.addLog('block port=<N>                   - Block specific port');
    this.addLog('rate-limit http <RATE>/s         - Limit HTTP request rate');
    this.addLog('drop proto=<P> port=<N> size><S> - Drop large packets');
    this.addLog('show attacks                     - List active attacks');
    this.addLog('show threat-intel                - Show threat intelligence');
    this.addLog('clear                            - Clear console');
    this.addLog('help                             - Show this help');
    this.addLog('');
  }

  /**
   * Affiche les attaques actives
   */
  showAttacks(): void {
    const activeAttacks = this.gameState.activeAttacks.filter(a => !a.isBlocked);

    if (activeAttacks.length === 0) {
      this.addLog('✅ No active attacks detected');
      return;
    }

    this.addLog('');
    this.addLog('=== ACTIVE THREATS ===');
    activeAttacks.forEach(attack => {
      this.addLog(`[${attack.severity}] ${attack.attackType}`);
      this.addLog(`  Source: ${attack.sourceIp} (${attack.sourceCountry})`);
      this.addLog(`  Target: Port ${attack.targetPort}/${attack.protocol}`);
      this.addLog(`  Rate: ${attack.requestsPerSecond.toLocaleString()} req/s`);
      this.addLog('');
    });
  }

  /**
   * Affiche le threat intel
   */
  showThreatIntel(): void {
    this.addLog('');
    this.addLog('=== THREAT INTELLIGENCE FEED ===');
    this.gameState.activeAttacks.forEach(attack => {
      const status = attack.isBlocked ? '🟢 BLOCKED' : '🔴 ACTIVE';
      this.addLog(`${status} | ${attack.attackType} | ${attack.sourceIp} | Port ${attack.targetPort}`);
    });
    this.addLog('');
  }

  /**
   * Gère l'autocomplétion
   */
  onCommandInput(): void {
    if (this.currentCommand.length > 0) {
      this.commandSuggestions = this.firewallService.getCommandSuggestions(this.currentCommand);
      this.showSuggestions = this.commandSuggestions.length > 0;
    } else {
      this.showSuggestions = false;
    }
  }

  /**
   * Utilise une suggestion
   */
  useSuggestion(suggestion: string): void {
    this.currentCommand = suggestion;
    this.showSuggestions = false;
  }

  /**
   * Navigation dans l'historique avec flèches
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentCommand = this.commandHistory[this.historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.currentCommand = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.currentCommand = '';
      }
    }
  }

  /**
   * Ajoute un log au terminal
   */
  addLog(message: string): void {
    this.terminalLogs.push(message);

    // Auto-scroll
    setTimeout(() => {
      const terminal = document.querySelector('.terminal-output');
      if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
      }
    }, 10);
  }

  /**
   * Calcule la perte d'argent
   */
  calculateMoneyLoss(): void {
    const secondsElapsed = 60 - this.gameState.timeRemaining;
    this.moneySaved = Math.max(0, (60 - secondsElapsed) * 5000);
  }

  /**
   * Met à jour le niveau d'alerte
   */
  updateAlertLevel(): void {
    const blockedPercent = this.gameState.totalAttacks > 0
      ? (this.gameState.attacksBlocked / this.gameState.totalAttacks) * 100
      : 0;

    if (blockedPercent >= 90) this.alertLevel = 1;
    else if (blockedPercent >= 70) this.alertLevel = 3;
    else if (blockedPercent >= 50) this.alertLevel = 5;
    else if (blockedPercent >= 30) this.alertLevel = 7;
    else this.alertLevel = 10;
  }

  /**
   * Initialise le canvas pour le graphique
   */
  initCanvas(): void {
    if (!this.trafficCanvas) return;

    const canvas = this.trafficCanvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.canvasContext = canvas.getContext('2d') || undefined;
  }

  /**
   * Met à jour le traffic monitor (graphique)
   */
  updateTrafficMonitor(): void {
    if (!this.canvasContext) return;

    // Calculer le trafic basé sur les attaques actives
    const activeCount = this.gameState.activeAttacks.filter(a => !a.isBlocked).length;
    const totalRps = this.gameState.activeAttacks
      .filter(a => !a.isBlocked)
      .reduce((sum, a) => sum + a.requestsPerSecond, 0);

    this.requestsPerSecond = totalRps;
    this.trafficData.shift();
    this.trafficData.push(totalRps);

    // Dessiner le graphique
    this.drawTrafficGraph();
  }

  /**
   * Dessine le graphique de trafic
   */
  drawTrafficGraph(): void {
    if (!this.canvasContext) return;

    const ctx = this.canvasContext;
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(10, 14, 39, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Grille
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ligne de trafic
    const max = Math.max(...this.trafficData, 100000);
    ctx.beginPath();
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;

    this.trafficData.forEach((value, index) => {
      const x = (width / this.trafficData.length) * index;
      const y = height - (value / max) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Zone remplie
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.fill();

    // Ligne de référence normale
    const normalY = height - (2000 / max) * height;
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, normalY);
    ctx.lineTo(width, normalY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * Formatte le temps
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Retourne la classe CSS pour le niveau d'alerte
   */
  getAlertClass(): string {
    if (this.alertLevel <= 3) return 'alert-low';
    if (this.alertLevel <= 6) return 'alert-medium';
    return 'alert-critical';
  }

  /**
   * Retourne le nombre d'attaques actives (non bloquées)
   */
  getActiveAttacksCount(): number {
    return this.gameState.activeAttacks.filter(a => !a.isBlocked).length;
  }
}
