import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-simulation',
  templateUrl: './network-simulation.component.html',
  styleUrls: ['./network-simulation.component.scss']
})
export class NetworkSimulationComponent {

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
