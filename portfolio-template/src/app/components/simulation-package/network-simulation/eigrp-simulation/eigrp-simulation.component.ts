import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IntroEigrpComponent } from './intro/intro.component';

@Component({
  selector: 'app-eigrp-simulation',
  templateUrl: './eigrp-simulation.component.html',
  styleUrl: './eigrp-simulation.component.scss',
  imports: [
    IntroEigrpComponent,
    ReactiveFormsModule,
    CommonModule

  ]
})
export class EigrpSimulationComponent {

  showIntro: boolean = true;

  onStartSimulation() {
    this.showIntro = false;
  }

}
