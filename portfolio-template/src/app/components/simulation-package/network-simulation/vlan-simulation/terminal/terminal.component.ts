import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimulationService } from '../../../services/simulation.service';
import { SimulationStateService } from '../../../../../services/simulation-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FeedBackComponent } from '../feed-back/feed-back.component';
import { Howl } from 'howler';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class TerminalComponent implements OnInit, OnDestroy {
  command: string = '';
  terminalOutput: string = 'Initializing VLAN Configuration Terminal v3.7...\n\n';
  currentStep: number = 0;
  isProcessing: boolean = false;
  connectionQuality: number = 5;
  switchStatus: string = 'Switch: Ready\nVLANs: None\nPorts: Down';

  // Session backend
  private destroy$ = new Subject<void>();
  sessionId: number | null = null;
  score: number = 0;
  errorCount: number = 0;
  
  // Configuration du réseau
  networkNodes = Array.from({length: 15}, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
  }));
  
  nodeConnections = this.generateRandomConnections();
  
  // Configuration du serveur
  servers = [
    { id: 1, ledColor: '#ff3e3e', lights: Array(5).fill(0).map(() => ({ active: Math.random() > 0.5 })) },
    { id: 2, ledColor: '#ffeb3b', lights: Array(5).fill(0).map(() => ({ active: Math.random() > 0.5 })) },
    { id: 3, ledColor: '#4caf50', lights: Array(5).fill(0).map(() => ({ active: Math.random() > 0.5 })) }
  ];
  
  // Configuration des ports du switch
  switchPorts = Array.from({length: 24}, (_, i) => ({
    id: i + 1,
    active: false,
    vlan: 0
  }));
  
  // Sons
  keySound = new Howl({ src: ['assets/sounds/keypress.mp3'], volume: 0.3 });
  executeSound = new Howl({ src: ['assets/sounds/execute.mp3'], volume: 0.5 });
  successSound = new Howl({ src: ['assets/sounds/success.mp3'], volume: 0.4 });
  errorSound = new Howl({ src: ['assets/sounds/error.mp3'], volume: 0.4 });
  
  steps = [
    {
      command: 'vlan 10 VLAN-IT',
      message: 'VLAN 10 "VLAN-IT" créé avec succès.\nStatut : Actif\nMTU : 1500 octets',
      suggestion: 'Suivant : Créez le VLAN 20 pour la finance avec "vlan 20 VLAN-Finance"',
      action: () => {
        this.updateSwitchStatus('VLAN 10 créé\nPorts : Aucun assigné');
        this.animateServer(1, '#4caf50');
      }
    },
    {
      command: 'vlan 20 VLAN-Finance',
      message: 'VLAN 20 "VLAN-Finance" créé avec succès.\nStatut : Actif\nMTU : 1500 octets',
      suggestion: 'Suivant : Configurez l\'interface FastEthernet0/1 avec "interface fa0/1"',
      action: () => {
        this.updateSwitchStatus('VLANs : 10, 20\nPorts : Aucun assigné');
        this.animateServer(2, '#4caf50');
      }
    },
    {
      command: 'interface fa0/1',
      message: 'Entrée en mode configuration d\'interface pour FastEthernet0/1\nStatut actuel : Inactif\nCommandes disponibles :\n  switchport mode access\n  switchport access vlan X\n  no shutdown',
      suggestion: 'Suivant : Définissez le port en mode accès avec "switchport mode access"',
      action: () => {
        this.highlightPort(1);
      }
    },
    {
      command: 'switchport mode access',
      message: 'Le port FastEthernet0/1 est défini en mode ACCÈS.\nAssignation VLAN requise.',
      suggestion: 'Suivant : Assignez le VLAN 10 avec "switchport access vlan 10"',
      action: () => {
        this.updateSwitchStatus('Port Fa0/1 : Mode accès\nEn attente d\'assignation VLAN');
      }
    },
    {
      command: 'switchport access vlan 10',
      message: 'Le port FastEthernet0/1 est assigné au VLAN 10.\nConfiguration terminée.\nUtilisez "no shutdown" pour activer le port.',
      suggestion: 'Félicitations ! Vous avez terminé la configuration de base du VLAN.',
      action: () => {
        this.activatePort(1, 10);
        this.updateSwitchStatus('Port Fa0/1 : VLAN 10\nStatut : Actif');
        this.animateAllServers();
      }
    }
];

  constructor(
    private simulationService: SimulationService,
    private simulationState: SimulationStateService,
    private dialog: MatDialog,
    private router : Router
  ) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.initializeSession();
    this.typeWelcomeMessage();
    this.randomizeLights();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise ou restaure une session
   */
  initializeSession() {
    // Vérifier si une session existe déjà
    if (this.simulationState.isSessionActive) {
      this.sessionId = this.simulationState.sessionId;
      this.currentStep = this.simulationState.currentStep;
      console.log('Session restaurée:', this.sessionId, 'Step:', this.currentStep);
    } else {
      // Créer une nouvelle session
      this.startNewSession();
    }
  }

  /**
   * Démarre une nouvelle session backend
   */
  startNewSession() {
    const clientHash = this.simulationState.generateClientHash();
    const userAgent = navigator.userAgent;

    this.simulationService.startSession({
      type: 'VLAN',
      clientHash,
      userAgent
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.sessionId = response.sessionId;
        this.simulationState.initSession(response.sessionId);
        console.log('Nouvelle session créée:', this.sessionId);
      },
      error: (error) => {
        console.error('Erreur lors de la création de session:', error);
        this.terminalOutput += '\n⚠️ Erreur de connexion au serveur. Mode hors-ligne activé.\n\n> ';
      }
    });
  }

  typeWelcomeMessage() {
    const welcomeMessage = `Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(55)SE\n
Le temps de fonctionnement du switch est de 2 jours, 3 heures, 22 minutes\n
Le fichier d'image système est "flash:c2960-lanbasek9-mz.122-55.SE.bin"\n
Initialisation de la configuration VLAN du terminal... Prêt.\n
💡 Tapez "vlan 10 VLAN-IT" pour créer votre premier VLAN.\n\n> `;
    
    let i = 0;
    const typing = setInterval(() => {
      if (i < welcomeMessage.length) {
        this.terminalOutput += welcomeMessage.charAt(i);
        i++;
        this.scrollToBottom();
      } else {
        clearInterval(typing);
      }
    }, 20);
  }

  randomizeLights() {
    setInterval(() => {
      this.servers.forEach(server => {
        server.lights.forEach(light => {
          light.active = Math.random() > 0.7;
        });
      });
    }, 500);
  }

  generateRandomConnections() {
    const connections = [];
    for (let i = 0; i < 10; i++) {
      const node1 = Math.floor(Math.random() * this.networkNodes.length);
      let node2 = Math.floor(Math.random() * this.networkNodes.length);
      while (node2 === node1) node2 = Math.floor(Math.random() * this.networkNodes.length);
      
      connections.push({
        x1: this.networkNodes[node1].x,
        y1: this.networkNodes[node1].y,
        x2: this.networkNodes[node2].x,
        y2: this.networkNodes[node2].y
      });
    }
    return connections;
  }

  playKeySound() {
    this.keySound.play();
  }

  sendCommand() {
    if (!this.command.trim()) return;

    this.isProcessing = true;
    this.executeSound.play();
    
    const cleanedCommand = this.command.trim();
    this.terminalOutput += `# ${cleanedCommand}\n`;
    this.scrollToBottom();

    setTimeout(() => {
      this.processCommand(cleanedCommand);
      this.isProcessing = false;
    }, 800);
  }

  processCommand(command: string) {
    // Si pas de session, mode hors-ligne
    if (!this.sessionId) {
      this.processCommandOffline(command);
      return;
    }

    // Envoyer la commande au backend
    this.simulationService.sendCommand(this.sessionId, { rawCommand: command })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Sauvegarder dans l'état local
          this.simulationState.addCommand({
            command,
            status: response.status,
            message: response.message,
            timestamp: Date.now(),
            animationCue: response.animationCue
          });

          if (response.status === 'OK') {
            this.successSound.play();
            this.terminalOutput += response.message + '\n\n';

            // Exécuter l'animation correspondante
            if (response.animationCue) {
              this.executeAnimation(response.animationCue);
            }

            this.currentStep = response.stepIndex;

            // Si toutes les étapes sont terminées
            if (this.currentStep >= this.steps.length) {
              this.terminalOutput += '\n🚀 Configuration terminée! Calcul du score...\n\n> ';
              setTimeout(() => this.finishSession(), 2000);
            } else {
              this.terminalOutput += `💡 ${this.steps[this.currentStep - 1].suggestion}\n\n> `;
            }
          } else {
            this.errorSound.play();
            this.errorCount++;
            this.terminalOutput += `❌ ${response.message}\n\n> `;
          }

          this.command = '';
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de commande:', error);
          this.errorSound.play();
          this.terminalOutput += '\n⚠️ Erreur serveur. Réessayez.\n\n> ';
          this.command = '';
          this.scrollToBottom();
        }
      });
  }

  /**
   * Mode hors-ligne (fallback)
   */
  processCommandOffline(command: string) {
    const currentStep = this.steps[this.currentStep];

    if (command === currentStep.command) {
      this.successSound.play();
      this.terminalOutput += currentStep.message + '\n\n';
      this.terminalOutput += `💡 ${currentStep.suggestion}\n\n> `;

      currentStep.action();
      this.currentStep++;

      if (this.currentStep >= this.steps.length) {
        this.terminalOutput += '\n🚀 Configuration terminée!\n';
      }
    } else {
      this.errorSound.play();
      this.terminalOutput += `❌ Commande invalide. Attendu: "${currentStep.command}"\n\n> `;
    }

    this.command = '';
    this.scrollToBottom();
  }

  /**
   * Exécute une animation selon le cue
   */
  executeAnimation(cue: string) {
    switch (cue) {
      case 'vlan10Created':
        this.updateSwitchStatus('VLAN 10 créé\nPorts : Aucun assigné');
        this.animateServer(1, '#4caf50');
        break;
      case 'vlan20Created':
        this.updateSwitchStatus('VLANs : 10, 20\nPorts : Aucun assigné');
        this.animateServer(2, '#4caf50');
        break;
      case 'port1Selected':
        this.highlightPort(1);
        break;
      case 'port1AccessMode':
        this.updateSwitchStatus('Port Fa0/1 : Mode accès\nEn attente d\'assignation VLAN');
        break;
      case 'port1AssignedVlan10':
        this.activatePort(1, 10);
        this.updateSwitchStatus('Port Fa0/1 : VLAN 10\nStatut : Actif');
        this.animateAllServers();
        break;
    }
  }

  /**
   * Termine la session et affiche le feedback
   */
  finishSession() {
    if (!this.sessionId) return;

    this.simulationService.finishSession(this.sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.score = response.score;
          this.simulationState.finishSession();

          this.terminalOutput += `\n📊 RÉSULTATS:\n`;
          this.terminalOutput += `   Score: ${response.score} points\n`;
          this.terminalOutput += `   Durée: ${Math.round(response.durationMs / 1000)}s\n`;
          this.terminalOutput += `   Succès: ${response.success ? 'OUI ✅' : 'NON ❌'}\n\n`;

          // Ouvrir le modal de feedback après 2s
          setTimeout(() => this.openFeedbackDialog(), 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la fin de session:', error);
        }
      });
  }

  /**
   * Ouvre le dialog de feedback
   */
  openFeedbackDialog() {
    const dialogRef = this.dialog.open(FeedBackComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.sessionId) {
        // Sauvegarder le feedback au backend
        this.simulationService.saveFeedback(this.sessionId, {
          experienceName: 'VLAN Simulation',
          feedbackType: 'rating',
          feedbackValue: result
        }).subscribe();
      }

      // Réinitialiser
      setTimeout(() => this.resetTerminal(), 1000);
    });
  }

  highlightPort(portId: number) {
    this.switchPorts.forEach(port => {
      port.active = port.id === portId;
    });
  }

  activatePort(portId: number, vlanId: number) {
    const port = this.switchPorts.find(p => p.id === portId);
    if (port) {
      port.active = true;
      port.vlan = vlanId;
    }
  }

  updateSwitchStatus(status: string) {
    this.switchStatus = `Switch Status:\n${status}\n\n` + 
      `VLAN Database:\n${this.getVlanStatus()}\n` + 
      `Port Status:\n${this.getPortStatus()}`;
  }

  getVlanStatus(): string {
    const vlans = [];
    if (this.currentStep >= 1) vlans.push('10 (VLAN-IT)');
    if (this.currentStep >= 2) vlans.push('20 (VLAN-Finance)');
    return vlans.length ? vlans.join(', ') : 'None';
  }

  getPortStatus(): string {
    if (this.currentStep < 3) return 'All ports: Down';
    
    const portStatus = [];
    if (this.currentStep >= 3) portStatus.push('Fa0/1: Configured');
    if (this.currentStep >= 5) portStatus[0] += ' (VLAN 10)';
    
    return portStatus.length ? portStatus.join('\n') : 'All ports: Down';
  }

  animateServer(serverId: number, color: string) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.ledColor = color;
      setTimeout(() => {
        server.lights.forEach(light => light.active = true);
      }, 300);
      setTimeout(() => {
        server.lights.forEach(light => light.active = Math.random() > 0.5);
      }, 1000);
    }
  }

  animateAllServers() {
    this.servers.forEach(server => {
      server.ledColor = '#4caf50';
      server.lights.forEach(light => light.active = true);
    });
    setTimeout(() => {
      this.servers.forEach(server => {
        server.lights.forEach(light => light.active = Math.random() > 0.5);
      });
    }, 1500);
  }

  private scrollToBottom() {
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }

  resetTerminal() {
    // Réinitialiser l'état du backend et localStorage
    this.simulationState.reset();

    // Réinitialiser les variables locales
    this.sessionId = null;
    this.currentStep = 0;
    this.score = 0;
    this.errorCount = 0;
    this.command = '';

    // Réinitialiser le terminal visuel
    this.terminalOutput = 'Resetting terminal...\n\n';
    this.switchStatus = 'Switch: Ready\nVLANs: None\nPorts: Down';

    this.switchPorts.forEach(port => {
      port.active = false;
      port.vlan = 0;
    });

    this.servers.forEach(server => {
      server.ledColor = '#ff3e3e';
      server.lights.forEach(light => light.active = false);
    });

    // Redémarrer une nouvelle session
    setTimeout(() => {
      this.startNewSession();
      this.typeWelcomeMessage();
    }, 1000);
  }
}