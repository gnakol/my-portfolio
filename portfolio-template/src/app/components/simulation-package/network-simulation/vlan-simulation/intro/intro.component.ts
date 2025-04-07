import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  imports : [
    CommonModule, 
    RouterModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    
  ]
})
export class IntroComponent {

  @Output() startSimulation = new EventEmitter<void>();

  constructor(private router : Router){}

  onStart() {
    this.startSimulation.emit();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}
