import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports : [
    CommonModule, // Requis pour les directives standard (ex : *ngFor)
    MatCardModule, // Requis pour <mat-card>
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  constructor(private dialog : MatDialog, private router : Router){}

  showSection(section: string) {
    this.router.navigate([section]);
  }

}
