import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro-eigrp',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  imports : [CommonModule, RouterModule]
})
export class IntroEigrpComponent {

  @Output() startSimulation = new EventEmitter<void>();

  onStart() {
    this.startSimulation.emit();
  }

}
