import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../../services/simulation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FeedBackComponent } from '../feed-back/feed-back.component';
import { Howl } from 'howler';

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
export class TerminalComponent implements OnInit {
  command: string = '';
  terminalOutput: string = 'Initializing VLAN Configuration Terminal v3.7...\n\n';
  currentStep: number = 0;
  isProcessing: boolean = false;
  connectionQuality: number = 5;
  switchStatus: string = 'Switch: Ready\nVLANs: None\nPorts: Down';
  
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
      message: 'VLAN 10 "VLAN-IT" created successfully.\nStatus: Active\nMTU: 1500 bytes',
      suggestion: 'Next: Create VLAN 20 for Finance with "vlan 20 VLAN-Finance"',
      action: () => {
        this.updateSwitchStatus('VLAN 10 created\nPorts: None assigned');
        this.animateServer(1, '#4caf50');
      }
    },
    {
      command: 'vlan 20 VLAN-Finance',
      message: 'VLAN 20 "VLAN-Finance" created successfully.\nStatus: Active\nMTU: 1500 bytes',
      suggestion: 'Next: Configure interface FastEthernet0/1 with "interface fa0/1"',
      action: () => {
        this.updateSwitchStatus('VLANs: 10, 20\nPorts: None assigned');
        this.animateServer(2, '#4caf50');
      }
    },
    {
      command: 'interface fa0/1',
      message: 'Entering interface configuration mode for FastEthernet0/1\nCurrent status: Down\nAvailable commands:\n  switchport mode access\n  switchport access vlan X\n  no shutdown',
      suggestion: 'Next: Set port to access mode with "switchport mode access"',
      action: () => {
        this.highlightPort(1);
      }
    },
    {
      command: 'switchport mode access',
      message: 'Port FastEthernet0/1 set to ACCESS mode.\nVLAN assignment required.',
      suggestion: 'Next: Assign VLAN 10 with "switchport access vlan 10"',
      action: () => {
        this.updateSwitchStatus('Port Fa0/1: Access mode\nWaiting for VLAN assignment');
      }
    },
    {
      command: 'switchport access vlan 10',
      message: 'Port FastEthernet0/1 assigned to VLAN 10.\nConfiguration complete.\nUse "no shutdown" to activate port.',
      suggestion: 'Congratulations! You have completed basic VLAN configuration.',
      action: () => {
        this.activatePort(1, 10);
        this.updateSwitchStatus('Port Fa0/1: VLAN 10\nStatus: Active');
        this.animateAllServers();
      }
    }
  ];

  constructor(
    private simulationService: SimulationService, 
    private dialog: MatDialog) {}

  ngOnInit() {
    this.typeWelcomeMessage();
    this.randomizeLights();
  }

  typeWelcomeMessage() {
    const welcomeMessage = `Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(55)SE\n
Switch uptime is 2 days, 3 hours, 22 minutes\n
System image file is "flash:c2960-lanbasek9-mz.122-55.SE.bin"\n
Initializing VLAN configuration terminal... Ready.\n
💡 Type "vlan 10 VLAN-IT" to create your first VLAN.\n\n> `;
    
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
    const currentStep = this.steps[this.currentStep];
    
    if (command === currentStep.command) {
      this.successSound.play();
      this.terminalOutput += currentStep.message + '\n\n';
      this.terminalOutput += `💡 ${currentStep.suggestion}\n\n> `;
      
      currentStep.action();
      this.currentStep++;
      
      if (this.currentStep >= this.steps.length) {
        this.terminalOutput += '\n🚀 Configuration complete! Resetting terminal...\n';
        setTimeout(() => this.resetTerminal(), 3000);
      }
    } else {
      this.errorSound.play();
      this.terminalOutput += `❌ Invalid command. Expected: "${currentStep.command}"\n\n> `;
    }
    
    this.command = '';
    this.scrollToBottom();
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
    this.terminalOutput = 'Resetting terminal...\n\n';
    this.currentStep = 0;
    this.command = '';
    this.switchStatus = 'Switch: Ready\nVLANs: None\nPorts: Down';
    this.switchPorts.forEach(port => {
      port.active = false;
      port.vlan = 0;
    });
    this.servers.forEach(server => {
      server.ledColor = '#ff3e3e';
      server.lights.forEach(light => light.active = false);
    });
    
    setTimeout(() => {
      this.typeWelcomeMessage();
      this.openFeedbackDialog();
    }, 1000);
  }

  openFeedbackDialog() {
    this.dialog.open(FeedBackComponent, {
      width: '500px',
      panelClass: 'feedback-dialog',
      data: { experienceName: 'VLAN Configuration Simulation' }
    });
  }
}