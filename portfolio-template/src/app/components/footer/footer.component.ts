import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddContactComponent } from '../contact-package/web-service/add-contact/add-contact.component';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number;

  constructor(
    private dialog : MatDialog,
    private router : Router

  ) {
    // Initialiser l'année courante
    this.currentYear = new Date().getFullYear();
  }

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
            // console.log('Contact ajouté:', result);
            // Ici tu peux ajouter la logique pour sauvegarder le contact
          }
        });
      }
}