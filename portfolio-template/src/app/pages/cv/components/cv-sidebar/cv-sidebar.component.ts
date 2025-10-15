import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-cv-sidebar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cv-sidebar.component.html',
  styleUrls: ['./cv-sidebar.component.scss']
})
export class CvSidebarComponent {
  email: string = 'gna.kolie@yahoo.fr';
  private accountId = 9;

  constructor(private accountService: AccountService) {}

  downloadCv(): void {
    this.accountService.getCvUrl(this.accountId).subscribe({
      next: (cvUrl: string) => {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'CV_Kolie.pdf';
        link.target = '_blank';
        link.click();
      },
      error: () => {
        alert('Impossible de télécharger le CV pour le moment.');
      }
    });
  }
}
