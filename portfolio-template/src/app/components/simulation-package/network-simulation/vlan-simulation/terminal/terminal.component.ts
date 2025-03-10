import { Component } from '@angular/core';
import { SimulationService } from '../../../services/simulation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimationComponent } from '../animation/animation.component';
import { MatDialog } from '@angular/material/dialog';
import { FeedBackComponent } from '../feed-back/feed-back.component';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  imports : [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AnimationComponent
  ]
})
export class TerminalComponent {

  command: string = '';
  
  terminalOutput: string = 'Terminal VLAN prêt.\n💡 Astuce : Tapez "vlan 10 VLAN-IT" pour créer le premier VLAN.\n';

  currentStep: number = 0;

  steps: { command: string; message: string; suggestion: string; animation?: string }[] = [
    {
      command: 'vlan 10 VLAN-IT',
      message: 'VLAN 10 (VLAN-IT) configuré avec succès !',
      suggestion: '💡 Astuce : Maintenant, créez le VLAN 20 pour le département Finance avec "vlan 20 VLAN-Finance"',
      animation: 'vlan10Created'
    },
    {
      command: 'vlan 20 VLAN-Finance',
      message: 'VLAN 20 (VLAN-Finance) configuré avec succès !',
      suggestion: '💡 Astuce : Assignez le port 1 au VLAN 10 avec "interface fa0/1"',
      animation: 'vlan20Created'
    },
    {
      command: 'interface fa0/1',
      message: 'Port 1 sélectionné. Utilisez "switchport mode access"',
      suggestion: '💡 Astuce : Entrez "switchport mode access"',
      animation: 'port1Selected'
    },
    {
      command: 'switchport mode access',
      message: 'Mode access activé sur le port 1. Assignez le VLAN 10.',
      suggestion: '💡 Astuce : Entrez "switchport access vlan 10"',
      animation: 'modeAccessSet'
    },
    {
      command: 'switchport access vlan 10',
      message: 'Port 1 assigné au VLAN 10. Configuration terminée !',
      suggestion: '🎉 Félicitations ! Vous avez terminé la configuration du VLAN.',
      animation: 'vlan10Assigned'
    }
];

constructor(private simulationService : SimulationService, private dialog : MatDialog){}


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

      // Déclenche l'animation correspondante
      if (currentStepData.animation) {
          this.triggerAnimation(currentStepData.animation);
      }

      // Appeler le service backend pour enregistrer en base de données
      if (currentStepData.command.startsWith('vlan')) {
          const [_, vlanId, vlanName] = cleanedCommand.split(' ');
          this.simulationService.configureVlan(vlanId, vlanName).subscribe(
              (response) => {
                  console.log(`✅ VLAN ${vlanId} enregistré en base : ${response.expectedResult}`);
              },
              (error) => {
                  console.error(`❌ Erreur lors de l'enregistrement du VLAN : ${error.message}`);
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


currentAnimation: string = '';

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
  this.terminalOutput = 'Terminal VLAN prêt.\n💡 Astuce : Tapez "vlan 10 VLAN-IT" pour créer le premier VLAN.\n';
  this.currentStep = 0;
  this.command = '';
  this.currentAnimation = '';

  this.openFeedbackDialog();
}

openFeedbackDialog() {
  this.dialog.open(FeedBackComponent, {
    width: '400px',
    data: { experienceName: 'Configuration VLAN' }
  });
}


}

