import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-monitoring-intro',
  standalone: true,
  templateUrl: './monitoring-intro.component.html',
  styleUrls: ['./monitoring-intro.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule
  ]
})
export class MonitoringIntroComponent {
  @Output() startMonitoring = new EventEmitter<void>();

  constructor(private router : Router){}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onStart() {
    this.startMonitoring.emit();
  }
}
