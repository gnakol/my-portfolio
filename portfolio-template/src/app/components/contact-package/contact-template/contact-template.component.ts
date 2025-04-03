import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddContactComponent } from '../web-service/add-contact/add-contact.component';

@Component({
  selector: 'app-contact-template',
  templateUrl: './contact-template.component.html',
  styleUrls: ['./contact-template.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class ContactTemplateComponent {

  contactCount = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  navigateTo(route: string): void {
    if (route === 'add-contact') {
      this.openAddContactDialog();
    } else {
      this.router.navigate([route]);
    }
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '100%',
      maxWidth: '500px',
      panelClass: 'contact-modal-container',
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Contact ajouté:', result);
        // Ici tu peux ajouter la logique pour sauvegarder le contact
      }
    });
  }
}