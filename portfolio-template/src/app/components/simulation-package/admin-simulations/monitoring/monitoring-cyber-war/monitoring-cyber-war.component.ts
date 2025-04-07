import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Command {
  text: string;
  output: string;
}

interface CCTVFeed {
  label: string;
  content: string;
}

interface TimelineMarker {
  step: number;
  position: number;
  label: string;
}

interface QuickCommand {
  command: string;
  label: string;
  minStep: number;
}

@Component({
  selector: 'app-monitoring-cyber-war',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-cyber-war.component.html',
  styleUrl: './monitoring-cyber-war.component.scss'
})
export class MonitoringCyberWarComponent implements OnInit {
  currentCommand: string = '';
  commandHistory: Command[] = [];
  currentStep: number = 0;
  cpuCritical: boolean = true;
  incidentResolved: boolean = false;
  elapsedTime: string = '00:00';
  timePercentage: number = 0;
  startTime!: Date;
  showTutorial: boolean = true;

  cctvFeeds: CCTVFeed[] = [
    { 
      label: 'DCAM-42 (PROD-APP-01)', 
      content: '⚠️ <span class="red-blink">CPU: 100%</span> | MEM: 98%' 
    },
    { 
      label: 'GRAFANA-ALERTS', 
      content: '🚨 <span class="red-text">API Latency: 4.2s</span>' 
    }
  ];

  timelineMarkers: TimelineMarker[] = [
    { step: 0, position: 0, label: "Début" },
    { step: 1, position: 30, label: "Connexion" },
    { step: 2, position: 60, label: "Diagnostic" },
    { step: 3, position: 90, label: "Résolution" }
  ];

  quickCommands: QuickCommand[] = [
    { command: 'ssh admin@prod-app-01', label: 'Connexion SSH', minStep: 0 },
    { command: 'htop', label: 'Voir processus', minStep: 1 },
    { command: 'kill -9 123', label: 'Tuer processus', minStep: 2 },
    { command: 'systemctl restart payment_api', label: 'Redémarrer service', minStep: 3 }
  ];

  constructor(private router : Router){}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.startTime = new Date();
    this.startTimer();
    this.initCommandHistory();
  }

  private startTimer(): void {
    setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
      const mins = Math.floor(diff / 60).toString().padStart(2, '0');
      const secs = (diff % 60).toString().padStart(2, '0');
      this.elapsedTime = `${mins}:${secs}`;
      this.timePercentage = Math.min(diff / 180 * 100, 100);
    }, 1000);
  }

  private initCommandHistory(): void {
    this.addCommandOutput('System Alert', 'CRITICAL: CPU 100% on PROD-APP-01', true);
  }

  executeCommand(): void {
    if (!this.currentCommand.trim() || this.incidentResolved) return;

    const cmd = this.currentCommand.trim();
    let output = '';

    switch(cmd.toLowerCase()) {
      case 'ssh admin@prod-app-01':
        output = '🔒 <span class="green-text">Connected to PROD-APP-01 (Ubuntu 22.04 LTS)</span>';
        this.currentStep = 1;
        break;
        
      case 'htop':
        output = `PID   USER      CPU%  MEM%  COMMAND
123   root      99.9  45%   payment_api
456   www-data   0.1  12%   nginx`;
        output += '\n⚠️ <span class="red-text">WARNING: Process 123 consuming all CPU</span>';
        this.currentStep = 2;
        break;
        
      case 'kill -9 123':
        output = '💀 <span class="green-text">Process 123 (payment_api) terminated</span>';
        this.cpuCritical = false;
        this.currentStep = 3;
        this.updateCCTV('DCAM-42 (PROD-APP-01)', '✅ <span class="green-text">CPU: 24% | MEM: 45%</span>');
        break;
        
      case 'systemctl restart payment_api':
        output = '🔄 <span class="green-text">Service restarted successfully</span>';
        this.incidentResolved = true;
        this.updateCCTV('GRAFANA-ALERTS', '✅ <span class="green-text">API Latency: 0.2s</span>');
        break;
        
      default:
        output = '❌ <span class="red-text">Command not found or not allowed in this context</span>';
    }

    this.addCommandOutput(cmd, output);
    this.currentCommand = '';
  }

  private addCommandOutput(command: string, output: string, isSystem: boolean = false): void {
    this.commandHistory.push({
      text: isSystem ? '' : command,
      output: output
    });
  }

  private updateCCTV(label: string, content: string): void {
    const feedIndex = this.cctvFeeds.findIndex(f => f.label === label);
    if (feedIndex !== -1) {
      this.cctvFeeds[feedIndex].content = content;
    }
  }

  autoFill(command: string): void {
    this.currentCommand = command;
    this.executeCommand();
  }

  showHint(): void {
    const hints = [
      'Utilisez "ssh admin@prod-app-01" pour vous connecter',
      'Tapez "htop" pour voir les processus en cours',
      'Le PID critique est 123 (kill -9 123)',
      'Redémarrez le service avec "systemctl restart payment_api"'
    ];
    alert(hints[Math.min(this.currentStep, hints.length - 1)]);
  }

  getPlaceholder(): string {
    const placeholders = [
      'Tapez "ssh admin@prod-app-01" pour commencer',
      'Analysez avec "htop"',
      'Terminez le processus avec "kill -9 123"',
      'Redémarrez le service'
    ];
    return this.incidentResolved ? 'Incident résolu!' : placeholders[Math.min(this.currentStep, placeholders.length - 1)];
  }

  jumpToStep(step: number): void {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }

  toggleTutorial(): void {
    this.showTutorial = !this.showTutorial;
  }

  resetSimulation(): void {
    this.currentCommand = '';
    this.commandHistory = [];
    this.currentStep = 0;
    this.cpuCritical = true;
    this.incidentResolved = false;
    this.startTime = new Date();
    this.timePercentage = 0;
    this.initCommandHistory();
    
    this.cctvFeeds = [
      { label: 'DCAM-42 (PROD-APP-01)', content: '⚠️ <span class="red-blink">CPU: 100%</span> | MEM: 98%' },
      { label: 'GRAFANA-ALERTS', content: '🚨 <span class="red-text">API Latency: 4.2s</span>' }
    ];
  }
}