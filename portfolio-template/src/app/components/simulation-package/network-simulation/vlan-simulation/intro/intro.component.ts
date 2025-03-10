import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  imports : [CommonModule, RouterModule]
})
export class IntroComponent {

  @Output() startSimulation = new EventEmitter<void>();

  onStart() {
    this.startSimulation.emit();
  }

}
