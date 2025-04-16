import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-template',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './project-template.component.html',
  styleUrls: ['./project-template.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectTemplateComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  reloadData(): void {
    console.log('Données des projets rechargées !');
    // Ajoutez ici la logique pour recharger les données des projets
  }
}