import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-network-simulation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './network-simulation.component.html',
  styleUrls: ['./network-simulation.component.scss']
})
export class NetworkSimulationComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}