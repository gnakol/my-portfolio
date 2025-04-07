import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security-simulations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security-simulations.component.html',
  styleUrls: ['./security-simulations.component.scss']
})
export class SecuritySimulationsComponent {
  
  constructor(
    private router : Router

  ){}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}