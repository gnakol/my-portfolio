import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-simulations',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin-simulations.component.html',
  styleUrls: ['./admin-simulations.component.scss']
})
export class AdminSimulationsComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
