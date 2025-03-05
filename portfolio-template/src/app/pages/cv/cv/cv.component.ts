import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../../services/experience.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [
    CommonModule, // Requis pour les directives standard (ex : *ngFor)
    MatCardModule, // Requis pour <mat-card>
    MatButtonModule, // Requis pour <button mat-raised-button>
  ],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent implements OnInit {

  email: string = 'gna.kolie@yahoo.fr';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  showSection(section: string): void {
    this.router.navigate([section]);
  }

  generatePdf(): void {

    this.router.navigate(['/pdf-generator']);
  }
} 