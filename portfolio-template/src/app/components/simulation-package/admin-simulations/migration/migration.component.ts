import { Component } from '@angular/core';
import { MigrationIntroComponent } from './migration-intro/migration-intro.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-migration',
  standalone: true,
  templateUrl: './migration.component.html',
  styleUrl: './migration.component.scss',
  imports : [
    MigrationIntroComponent,
    CommonModule,
    ReactiveFormsModule

  ]
})
export class MigrationComponent {

  showIntroMigration: boolean = true;

  onStartSimulation() {
    this.showIntroMigration = false;
  }

}
