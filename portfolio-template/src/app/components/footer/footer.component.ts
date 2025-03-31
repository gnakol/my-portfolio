import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number;

  constructor() {
    // Initialiser l'année courante
    this.currentYear = new Date().getFullYear();
  }
}