import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Ajouté pour MatSnackBar
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-experience-template',
  imports : [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule, // Ajouté ici
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  templateUrl: './experience-template.component.html',
  styleUrls: ['./experience-template.component.scss']
})
export class ExperienceTemplateComponent {

  constructor(private router: Router) {}

  // Naviguer vers une page spécifique
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Recharger les données
  reloadData(): void {
    // Logique pour recharger les données
    console.log('Données rechargées !');
  }
}