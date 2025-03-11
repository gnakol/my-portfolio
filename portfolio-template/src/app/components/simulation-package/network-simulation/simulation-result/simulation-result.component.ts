import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulation-result',
  templateUrl: './simulation-result.component.html',
  styleUrls: ['./simulation-result.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SimulationResultComponent implements OnInit {
  
  startAnimation = false;

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation = true;
    }, 1000); // Démarrer l’animation après 1 seconde

    setTimeout(() => {
      this.startAnimation = false;
    }, 6000); // Arrêter après 6 secondes
  }

  restartSimulation() {
    location.reload();
  }
}
