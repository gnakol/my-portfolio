import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro-eigrp',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class IntroEigrpComponent {
  @Output() startSimulation = new EventEmitter<void>();

  step: number = 1;
  showRouter: boolean = false;
  showPc: boolean = false;
  showCable: boolean = false;
  showButton: boolean = false;

  constructor() {
    this.runSlideshow();
  }

  runSlideshow() {
    let interval = setInterval(() => {
      this.step++;

      if (this.step === 6) {
        clearInterval(interval);
        this.showRouter = true;

        setTimeout(() => this.showPc = true, 1000);
        setTimeout(() => this.showCable = true, 2000);
        setTimeout(() => this.showButton = true, 3000);
      }
    }, 2000);
  }

  onStart() {
    this.startSimulation.emit();
  }
}
