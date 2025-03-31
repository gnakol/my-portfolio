import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent {
  email: string = 'gna.kolie@yahoo.fr';

  constructor(private router: Router) {}

  showSection(section: string): void {
    this.router.navigate([section]);
  }

  generatePdf(): void {
    // Implémentation de la génération PDF
    this.router.navigate(['/pdf-generator']);
  }
}