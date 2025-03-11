import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro-dhcp',
  templateUrl: './intro-dhcp.component.html',
  styleUrls: ['./intro-dhcp.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class IntroDhcpComponent {
  @Input() configType: 'relay' | 'full' | null = null;
  @Output() backToChoice = new EventEmitter<void>(); // 🔥 Événement pour informer le parent

  step: number = 1;
  showRouter: boolean = false;
  showServer: boolean = false;
  showPc: boolean = false;
  showCable: boolean = false;
  showButton: boolean = false;

  constructor(private router : Router) {
    this.runSlideshow();
  }

  runSlideshow() {
    let interval = setInterval(() => {
      this.step++;

      if (this.step === 5) {
        clearInterval(interval);
        this.showRouter = true;

        if (this.configType === 'relay') {
          setTimeout(() => this.showServer = true, 800);
        }

        setTimeout(() => this.showPc = true, 1600);
        setTimeout(() => this.showCable = true, 2400);
        setTimeout(() => this.showButton = true, 3000);
      }
    }, 2000);
  }

  getSimulationRoute(): string {
    return this.configType === 'relay' ? '/dhcp-relay' : '/dhcp-full';
  }

  onStart() {
    const route = this.getSimulationRoute();
    this.router.navigate([route]).then(success => {
      if (!success) {
        console.error('Échec de la navigation vers', route);
      }
    }).catch(err => {
      console.error('Erreur de navigation:', err);
    });
  }

  goBack() {
    this.backToChoice.emit(); // 🔥 Émet un événement pour revenir en arrière
  }
}
