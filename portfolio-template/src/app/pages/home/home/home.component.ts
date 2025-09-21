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
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  progress: number = 55; // Votre progression actuelle en %

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    // Compte à rebours jusqu'à la rentrée ASTON
    const targetDate = new Date('2025-10-06T09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const d = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
      const h = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const m = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));

      this.days = d.toString().padStart(2, '0');
      this.hours = h.toString().padStart(2, '0');
      this.minutes = m.toString().padStart(2, '0');

      // progression reste statique pour l’instant (pas de recalcul ici)
    };

    updateCountdown();
    setInterval(updateCountdown, 60000);
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
}