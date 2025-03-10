import { Component } from '@angular/core';
import { SimulationService } from '../../../services/simulation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimationEigrpComponent } from '../animation-eigrp/animation-eigrp.component';
import { MatDialog } from '@angular/material/dialog';
import { TerminalDialogComponent } from '../terminal-dialog/terminal-dialog.component';


@Component({
  selector: 'app-terminal-eigrp',
  templateUrl: './terminal-eigrp.component.html',
  styleUrls: ['./terminal-eigrp.component.scss'],
  imports : [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AnimationEigrpComponent
  ]
})
export class TerminalEigrpComponent {

  command: string = '';
  terminalOutput: string = 'Terminal EIGRP prêt.\n💡 Astuce : Tapez "router eigrp 1" pour commencer la configuration.\n';

  currentStep: number = 0;
  currentAnimation: string = '';

  steps: { command: string; message: string; suggestion: string; animation?: string }[] = [
    {
      command: 'router eigrp 1',
      message: 'EIGRP activé avec succès sur le routeur !',
      suggestion: '💡 Astuce : Entrez "network 192.168.1.0 0.0.0.255" pour ajouter un réseau',
      animation: 'eigrpActivated'
    },
    {
      command: 'network 192.168.1.0 0.0.0.255',
      message: 'Réseau 192.168.1.0 ajouté à EIGRP.',
      suggestion: '💡 Astuce : Entrez "network 192.168.2.0 0.0.0.255" pour ajouter un autre réseau',
      animation: 'networkAdded1'
    },
    {
      command: 'network 192.168.2.0 0.0.0.255',
      message: 'Réseau 192.168.2.0 ajouté à EIGRP.',
      suggestion: '💡 Astuce : Utilisez "show ip route" pour vérifier les routes configurées.',
      animation: 'networkAdded2'
    },
    {
      command: 'show ip route',
      message: 'Routes EIGRP affichées avec succès !',
      suggestion: '💡 Astuce : Testez la connectivité avec "ping 192.168.2.1"',
      animation: 'showRoutes'
    },
    {
      command: 'ping 192.168.2.1',
      message: 'Ping réussi ! La configuration EIGRP est opérationnelle.',
      suggestion: '🎉 Félicitations ! Vous avez terminé la configuration EIGRP.',
      animation: 'pingSuccess'
    }
  ];

  constructor(private simulationService: SimulationService, private dialog : MatDialog) {}

  sendCommand() {
    if (!this.command.trim()) {
        return;
    }

    const cleanedCommand = this.command.trim();
    this.terminalOutput += `> ${cleanedCommand}\n`;
    this.scrollToBottom();

    const currentStepData = this.steps[this.currentStep];

    if (cleanedCommand === currentStepData.command) {
        this.terminalOutput += currentStepData.message + '\n';
        this.terminalOutput += `💡 Astuce : ${currentStepData.suggestion}\n`;

        if (currentStepData.animation) {
            this.triggerAnimation(currentStepData.animation);
        }

        if (currentStepData.command.startsWith('ping')) {
            this.simulationService.executePing('192.168.2.1').subscribe(
                (response) => {
                    console.log(`✅ Résultat du ping : ${response.expectedResult}`);
                },
                (error) => {
                    console.error(`❌ Erreur lors du ping : ${error.message}`);
                }
            );
        }

        this.currentStep++;
    } else {
        this.terminalOutput += `❌ Commande incorrecte. Essayez : ${currentStepData.command}\n`;
    }

    this.command = '';

    if (this.currentStep >= this.steps.length) {
      this.terminalOutput += '🚀 Simulation terminée ! Le terminal va se réinitialiser...\n';
      setTimeout(() => this.resetTerminal(), 3000);
    }
  }

  openTerminalDialog() {
    const dialogRef = this.dialog.open(TerminalDialogComponent, {
      width: '600px',
      height: '500px',
      disableClose: true, // Empêche la fermeture automatique
      hasBackdrop: false, // Enlève le fond gris
      panelClass: 'custom-terminal-dialog'
    });

    dialogRef.afterClosed().subscribe((command: string) => {
      if (command) {
        this.handleCommand(command);
      }
    });
}

handleCommand(command: string) {
    const cleanedCommand = command.trim();
    this.terminalOutput += `> ${cleanedCommand}\n`;

    const currentStepData = this.steps[this.currentStep];

    if (cleanedCommand === currentStepData.command) {
        this.terminalOutput += currentStepData.message + '\n';
        this.terminalOutput += `💡 Astuce : ${currentStepData.suggestion}\n`;

        if (currentStepData.animation) {
            this.triggerAnimation(currentStepData.animation);
        }

        this.currentStep++;
    } else {
        this.terminalOutput += `❌ Commande incorrecte. Essayez : ${currentStepData.command}\n`;
    }
}


  triggerAnimation(animationType: string) {
      console.log(`🔄 Déclenchement de l'animation : ${animationType}`);
      this.currentAnimation = animationType;
  }

  private scrollToBottom() {
    const terminalOutputElement = document.querySelector('.terminal-output');
    if (terminalOutputElement) {
        terminalOutputElement.scrollTop = terminalOutputElement.scrollHeight;
    }
  }

  resetTerminal() {
    this.terminalOutput = 'Terminal EIGRP prêt.\n💡 Astuce : Tapez "router eigrp 1" pour commencer la configuration.\n';
    this.currentStep = 0;
    this.command = '';
    this.currentAnimation = '';
  }
}
