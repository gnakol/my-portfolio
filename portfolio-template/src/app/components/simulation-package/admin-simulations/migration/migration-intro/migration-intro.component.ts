import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-migration-intro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './migration-intro.component.html',
  styleUrls: ['./migration-intro.component.scss']
})
export class MigrationIntroComponent {

  @Output() startSimulation = new EventEmitter<void>();

  onStart()
  {
    this.startSimulation.emit();
  }
}
