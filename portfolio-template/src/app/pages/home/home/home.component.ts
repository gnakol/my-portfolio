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
  progress: number = 45; // Votre progression actuelle en %

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    // Date cible pour la certification (1er août 2023)
    const targetDate = new Date('2023-08-01').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      // Calculs pour jours, heures, minutes
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      
      // Mise à jour de la progression (exemple)
      if (distance > 0) {
        const totalDays = Math.floor((new Date('2023-08-01').getTime() - new Date('2023-01-01').getTime()) / (1000 * 60 * 60 * 24));
        const daysPassed = totalDays - Math.floor(distance / (1000 * 60 * 60 * 24));
        this.progress = Math.min(100, Math.floor((daysPassed / totalDays) * 100));
      } else {
        this.progress = 100;
      }
    };
    
    // Mise à jour immédiate
    updateCountdown();
    
    // Mise à jour toutes les minutes
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