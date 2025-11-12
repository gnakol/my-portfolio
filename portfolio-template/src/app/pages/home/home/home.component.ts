import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddContactComponent } from '../../../components/contact-package/web-service/add-contact/add-contact.component';
import { InfraRoadmapComponent } from '../../ccna-roadmap/ccna-roadmap.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone : false,

})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Plus de countdown, component simplifié
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
        //console.log('Contact ajouté:', result);
      }
    });
  }

  openCCNADialog(): void {
    this.dialog.open(InfraRoadmapComponent, {
      width: '100%',
      maxWidth: '800px',
      panelClass: 'roadmap-modal-container',
      backdropClass: 'custom-backdrop'
    });
  }

  openCalendly(): void {
    // Option 1: Ouvrir Calendly dans un nouvel onglet
    // window.open('https://calendly.com/votre-compte/consultation-15min', '_blank');

    // Option 2: Pour l'instant, ouvrir le formulaire de contact
    this.openAddContactDialog();
  }
}