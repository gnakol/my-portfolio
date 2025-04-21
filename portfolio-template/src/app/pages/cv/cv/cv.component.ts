import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent {
  email: string = 'gna.kolie@yahoo.fr';
  private accountId = 9;

  constructor(
    private router: Router,
    private accountService : AccountService
  ) {}

  showSection(section: string): void {
    this.router.navigate([section]);
  }

  generatePdf(): void {
    // Implémentation de la génération PDF
    this.router.navigate(['/pdf-generator']);
  }

  downloadCv(): void {
    this.accountService.getCvUrl(this.accountId).subscribe({
      next: (cvUrl: string) => {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'CV_Kolie.pdf';
        link.target = '_blank';
        link.click();
      },
      error: (err) => {
        //console.error('Erreur téléchargement CV :', err);
        alert('Impossible de télécharger le CV pour le moment.');
      }
    });
  }

}