import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Attack {
  id: number;
  type: string;
  position: number;
  blocked: boolean;
  port: number;
  protocol: string;
}

interface Server {
  name: string;
  compromised: boolean;
}

@Component({
  selector: 'app-go-simulation-firewall',
  standalone: true,
  templateUrl: './go-simulation-firewall.component.html',
  styleUrl: './go-simulation-firewall.component.scss',
  imports : [
    CommonModule,
    FormsModule,

  ]
})
export class GoSimulationFirewallComponent implements OnInit {

    // Game State
    currentCommand: string = '';
    logs: string[] = [];
    firewallRules: string[] = [];
    currentAttacks: Attack[] = [];
    servers: Server[] = [
      { name: 'WEB-SRV', compromised: false },
      { name: 'DB-SRV', compromised: false },
      { name: 'AD-SRV', compromised: false }
    ];
    
    // Stats
    blockedAttacks: number = 0;
    totalAttacks: number = 0;
    score: number = 0;
    elapsedTime: string = '00:00';
    startTime!: Date;
    alertLevel: number = 0;
    
    // Game Flow
    showTutorial: boolean = true;
    gameOver: boolean = false;
    attackInterval: any;
    timeInterval: any;

  ngOnInit(): void {
    this.logs.push('Initializing firewall...');
    this.logs.push('Type "help" for available commands');
  }

  startGame(): void {
    this.showTutorial = false;
    this.startTime = new Date();
    this.updateTimer();
    this.timeInterval = setInterval(() => this.updateTimer(), 1000);
    
    // Start attack waves
    this.attackInterval = setInterval(() => this.generateAttack(), 2000);
    
    this.logs.push('🚨 ALERT: Incoming attacks detected!');
    this.logs.push('Configure firewall rules to block them!');
    this.logs.push('Example: "block proto=tcp port=80"');
  }

  executeCommand(): void {
    if (!this.currentCommand.trim() || this.gameOver) return;
    
    const cmd = this.currentCommand.trim().toLowerCase();
    this.logs.push(`# ${cmd}`);
    
    // Process commands
    if (cmd === 'help') {
      this.showHelp();
    } else if (cmd === 'show rules') {
      this.showRules();
    } else if (cmd === 'show attacks') {
      this.showAttacks();
    } else if (cmd.startsWith('block ') || cmd.startsWith('allow ')) {
      this.addFirewallRule(cmd);
    } else if (cmd === 'clear') {
      this.logs = [];
    } else {
      this.logs.push('❌ Error: Unknown command. Type "help" for assistance.');
    }
    
    this.currentCommand = '';
    this.checkRules();
  }

  addFirewallRule(rule: string): void {
    if (this.firewallRules.includes(rule)) {
      this.logs.push(`⚠️ Rule already exists: ${rule}`);
      return;
    }
    
    this.firewallRules.push(rule);
    this.logs.push(`✅ Added rule: ${rule}`);
    this.score += 10;
  }

  removeRule(rule: string): void {
    this.firewallRules = this.firewallRules.filter(r => r !== rule);
    this.logs.push(`🗑️ Removed rule: ${rule}`);
    this.score -= 5;
  }

  generateAttack(): void {
    if (this.gameOver) return;
    
    const attackTypes = [
      { type: 'ddos', port: 80, protocol: 'tcp' },
      { type: 'bruteforce', port: 22, protocol: 'tcp' },
      { type: 'sql-injection', port: 3306, protocol: 'tcp' },
      { type: 'dns-amplification', port: 53, protocol: 'udp' }
    ];
    
    const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const newAttack: Attack = {
      id: Date.now(),
      type: attack.type,
      position: 0,
      blocked: false,
      port: attack.port,
      protocol: attack.protocol
    };
    
    this.currentAttacks.push(newAttack);
    this.totalAttacks++;
    this.alertLevel = Math.min(10, this.alertLevel + 1);
    
    // Animate attack
    const attackInterval = setInterval(() => {
      newAttack.position += 2;
      
      if (newAttack.position > 600 && !newAttack.blocked) {
        this.serverHit(newAttack);
        clearInterval(attackInterval);
        this.currentAttacks = this.currentAttacks.filter(a => a.id !== newAttack.id);
      } else if (newAttack.blocked) {
        clearInterval(attackInterval);
        setTimeout(() => {
          this.currentAttacks = this.currentAttacks.filter(a => a.id !== newAttack.id);
        }, 500);
      }
    }, 50);
  }

  checkRules(): void {
    this.currentAttacks.forEach(attack => {
      const ruleToBlock = `block proto=${attack.protocol} port=${attack.port}`;
      const ruleToAllow = `allow proto=${attack.protocol} port=${attack.port}`;
      
      if (this.firewallRules.includes(ruleToBlock)) {
        if (!attack.blocked) {
          attack.blocked = true;
          this.blockedAttacks++;
          this.score += 20;
          this.alertLevel = Math.max(0, this.alertLevel - 1);
          this.logs.push(`🛡️ Blocked ${attack.type.toUpperCase()} attack on port ${attack.port}`);
        }
      } else if (this.firewallRules.includes(ruleToAllow)) {
        this.serverHit(attack);
      }
    });
  }

  serverHit(attack: Attack): void {
    const randomServer = Math.floor(Math.random() * this.servers.length);
    this.servers[randomServer].compromised = true;
    this.logs.push(`💥 SERVER HIT! ${attack.type.toUpperCase()} attack penetrated on port ${attack.port}`);
    this.score = Math.max(0, this.score - 30);
    this.alertLevel = Math.min(10, this.alertLevel + 2);
    
    if (this.servers.filter(s => s.compromised).length >= 2) {
      this.endGame();
    }
  }

  endGame(): void {
    this.gameOver = true;
    clearInterval(this.attackInterval);
    clearInterval(this.timeInterval);
    this.logs.push('🔥 CRITICAL FAILURE: Too many servers compromised!');
    this.logs.push('Game over! Your final score: ' + this.score);
  }

  updateTimer(): void {
    const now = new Date();
    const diff = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    this.elapsedTime = `${mins}:${secs}`;
  }

  resetGame(): void {
    this.currentAttacks = [];
    this.firewallRules = [];
    this.blockedAttacks = 0;
    this.totalAttacks = 0;
    this.score = 0;
    this.alertLevel = 0;
    this.gameOver = false;
    this.servers.forEach(s => s.compromised = false);
    this.logs = ['System rebooted...', 'Ready for new session!'];
    this.startGame();
  }

  getPlaceholder(): string {
    if (this.gameOver) return 'Game over! Click REJOUER to restart';
    return this.showTutorial ? 'Press START to begin' : 'Enter firewall rule...';
  }

  getGrade(): string {
    const percentage = (this.blockedAttacks / this.totalAttacks) * 100;
    if (percentage >= 90) return '💎 ELITE HACKER';
    if (percentage >= 70) return '🛡️ SECURITY EXPERT';
    if (percentage >= 50) return '👨‍💻 IT ADMIN';
    return '😢 NOVICE';
  }

  showHelp(): void {
    this.logs.push('Available commands:');
    this.logs.push('block proto=<tcp/udp> port=<number> - Block specific traffic');
    this.logs.push('allow proto=<tcp/udp> port=<number> - Allow specific traffic');
    this.logs.push('show rules - List current firewall rules');
    this.logs.push('show attacks - List active attacks');
    this.logs.push('clear - Clear the console');
  }

  showRules(): void {
    if (this.firewallRules.length === 0) {
      this.logs.push('No active firewall rules. Add some protection!');
    } else {
      this.logs.push('Active firewall rules:');
      this.firewallRules.forEach(rule => this.logs.push(`- ${rule}`));
    }
  }

  showAttacks(): void {
    if (this.currentAttacks.length === 0) {
      this.logs.push('No active attacks detected. Stay vigilant!');
    } else {
      this.logs.push('Incoming attacks:');
      this.currentAttacks.forEach(attack => {
        this.logs.push(`- ${attack.type.toUpperCase()} on port ${attack.port} (${attack.protocol})`);
      });
    }
  }

  autoFill(command: string): void {
    this.currentCommand = command;
    
    // Si c'est une commande spéciale (comme "show attacks")
    if (command === 'show attacks') {
      this.executeCommand();
    }
    
    // Focus automatique sur l'input
    setTimeout(() => {
      const input = document.querySelector('.terminal-input input');
      if (input) (input as HTMLInputElement).focus();
    }, 0);
  }

}
