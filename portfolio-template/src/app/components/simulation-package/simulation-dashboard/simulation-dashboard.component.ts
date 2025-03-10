import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulation-dashboard',
  standalone: false,
  templateUrl: './simulation-dashboard.component.html',
  styleUrl: './simulation-dashboard.component.scss'
})
export class SimulationDashboardComponent {

  constructor(private router : Router){}

    // Naviguer vers une page spécifique
    navigateTo(route: string): void {
      this.router.navigate([route]);
    }

}
