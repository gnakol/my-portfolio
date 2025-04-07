import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimulationResultComponent } from '../../simulation-result/simulation-result.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimulationResultComponent
  ]
})
export class FullComponent {

  command: string = '';
  logs: string[] = [];

  configCompleted = false;

  router = { active: false };
  pc = { active: false };
  cables = [{ id: 1, connected: false, active: false }];

  guideCommands = [
    { command: "enable", completed: false },
    { command: "configure terminal", completed: false },
    { command: "service dhcp", completed: false },
    { command: "ip dhcp pool LAN", completed: false },
    { command: "network 192.168.1.0 255.255.255.0", completed: false },
    { command: "default-router 192.168.1.1", completed: false },
    { command: "lease 7", completed: false },
    { command: "exit", completed: false }
  ];

  currentCommandIndex = 0;
  commandError = false;

  constructor(private route : Router){}

  navigateTo(route: string): void {
    this.route.navigate([route]);
  }

  executeCommand() {
    if (!this.command.trim()) return;

    const expectedCommand = this.guideCommands[this.currentCommandIndex];
    if (this.command.trim() !== expectedCommand.command) {
      this.commandError = true;
      setTimeout(() => this.commandError = false, 1000);
      return;
    }

    this.commandError = false;
    expectedCommand.completed = true;
    this.applyEffects(expectedCommand.command);

    this.currentCommandIndex++;

    if (this.currentCommandIndex >= this.guideCommands.length) {
      this.logs.push("🎉 Configuration DHCP Full terminée avec succès !");
      this.configCompleted = true;
      return;
    }

    this.command = '';
  }

  applyEffects(command: string) {
    if (command.startsWith("enable")) {
      this.router.active = true;
    }
    if (command.startsWith("ip dhcp pool LAN")) {
      this.cables[0].active = true;
      setTimeout(() => this.cables[0].connected = true, 1000);
    }
    if (command.startsWith("network 192.168.1.0")) {
      this.pc.active = true;
    }
  }
}
