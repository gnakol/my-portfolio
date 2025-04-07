import { Component } from '@angular/core';
import { SimulationService } from '../../../services/simulation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimulationResultComponent } from '../../simulation-result/simulation-result.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-eigrp',
  templateUrl: './terminal-eigrp.component.html',
  styleUrls: ['./terminal-eigrp.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimulationResultComponent
  ]
})
export class TerminalEigrpComponent {

  command: string = '';

  logs: string[] = [];

  configCompleted = false;

  router = { active: false };
  pcs = [{ id: 1, active: false }, { id: 2, active: false }];
  cables = [{ id: 1, connected: false, active: false }, { id: 2, connected: false, active: false }];

  guideCommands = [
    { command: "router eigrp 1", completed: false },
    { command: "network 192.168.1.0 0.0.0.255", completed: false },
    { command: "network 192.168.2.0 0.0.0.255", completed: false },
  ];
  
  currentCommandIndex = 0;

  constructor(
    private simulationService: SimulationService,
    private route : Router

  ) {}

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

    // Marquer la commande comme complétée
    expectedCommand.completed = true;
    this.applyEffects(expectedCommand.command);

    // Passer à la commande suivante
    this.currentCommandIndex++;

    // Vérifier si c'était la dernière commande
    if (this.currentCommandIndex >= this.guideCommands.length) {
      this.logs.push("🎉 Configuration EIGRP terminée avec succès !");
      this.configCompleted = true;
      return;
    }

    this.command = ''; // Reset input
  }

  applyEffects(command: string) {
    if (command.startsWith("router eigrp")) {
      this.router.active = true;
    }
    if (command.startsWith("network 192.168.1.0")) {
      this.cables[0].active = true;
      setTimeout(() => this.cables[0].connected = true, 1000);
      this.pcs[0].active = true;
    }
    if (command.startsWith("network 192.168.2.0")) {
      this.cables[1].active = true;
      setTimeout(() => this.cables[1].connected = true, 1000);
      this.pcs[1].active = true;
    }
  }
}
