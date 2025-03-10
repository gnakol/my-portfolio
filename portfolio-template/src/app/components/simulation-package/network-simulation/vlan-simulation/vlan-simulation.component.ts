import { Component } from '@angular/core';
import { IntroComponent } from './intro/intro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';

@Component({
  selector: 'app-vlan-simulation',
  templateUrl: './vlan-simulation.component.html',
  styleUrls: ['./vlan-simulation.component.scss'],
  imports: [IntroComponent,
    ReactiveFormsModule,
    CommonModule

  ] // ✅ Ajout du composant dans les imports
})
export class VlanSimulationComponent {

  showIntro: boolean = true;

  onStartSimulation() {
    this.showIntro = false;
  }
}
