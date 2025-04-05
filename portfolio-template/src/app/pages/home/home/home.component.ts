import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddContactComponent } from '../../../components/contact-package/web-service/add-contact/add-contact.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router : Router,
    private dialog : MatDialog

  ){}

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
