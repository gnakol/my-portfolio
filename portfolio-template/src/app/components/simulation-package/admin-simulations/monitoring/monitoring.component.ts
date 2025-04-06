import { Component } from '@angular/core';
import { MonitoringIntroComponent } from './monitoring-intro/monitoring-intro.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.scss',
  imports : [
    MonitoringIntroComponent,
    CommonModule,
    ReactiveFormsModule,
    

  ]
})
export class MonitoringComponent {

  showIntroMonitoring: boolean = true;

  onStartSimulation() {
    this.showIntroMonitoring = false;
  }

}
