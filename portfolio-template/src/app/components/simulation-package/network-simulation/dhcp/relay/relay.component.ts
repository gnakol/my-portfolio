import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimulationResultComponent } from '../../simulation-result/simulation-result.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relay',
  templateUrl: './relay.component.html',
  styleUrls: ['./relay.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimulationResultComponent
  ]
})
export class RelayComponent {

  command: string = '';

  logs: string[] = [];

  configCompleted = false;

  server = { active: false };
  router = { active: false };
  pc = { active: false };
  cables = [{ id: 1, connected: false, active: false }, { id: 2, connected: false }];

  guideCommands = [
    { command: "enable", completed: false },
    { command: "configure terminal", completed: false },
    { command: "interface GigabitEthernet0/0", completed: false },
    { command: "ip address 192.168.1.1 255.255.255.0", completed: false },
    { command: "no shutdown", completed: false },
    { command: "interface GigabitEthernet0/1", completed: false },
    { command: "ip address 192.168.2.1 255.255.255.0", completed: false },
    { command: "no shutdown", completed: false },
    { command: "ip helper-address 192.168.2.100", completed: false }
  ];
  
  currentCommandIndex = 0;

  commandError = false;

  constructor(private route : Router){}

  navigateTo(route: string): void {
    this.route.navigate([route]);
  }

  executeCommand() {
    if (!this.command.trim()) return;

    // Vérifie si la commande tapée est correcte
    const expectedCommand = this.guideCommands[this.currentCommandIndex];
    if (this.command.trim() !== expectedCommand.command) {
      this.logs.push(`❌ Commande incorrecte. Essayez : ${expectedCommand.command}`);
      return;
    }

    this.commandError = false;

    // Marquer la commande comme complétée
    expectedCommand.completed = true;
    this.applyEffects(expectedCommand.command);

    // Passer à la commande suivante
    this.currentCommandIndex++;

    // Vérifier si c'était la dernière commande
    if (this.currentCommandIndex >= this.guideCommands.length) {
      this.logs.push("🎉 Configuration DHCP Relay terminée avec succès !");
      this.configCompleted = true;
      return;
    }

    this.command = ''; // Reset input
  }

  applyEffects(command: string) {
    if (command.startsWith("enable")) {
      this.router.active = true;
    }
    if (command.startsWith("interface GigabitEthernet0/0")) {
      this.cables[0].active = true;
      setTimeout(() => this.cables[0].connected = true, 1000);
      this.pc.active = true;
    }
    if (command.startsWith("interface GigabitEthernet0/1")) {
      this.cables[1].active = true;
      setTimeout(() => this.cables[1].connected = true, 1000);
      this.server.active = true;
    }
  }
}
