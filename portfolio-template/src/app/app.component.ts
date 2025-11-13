import { Component, OnInit } from '@angular/core';
import { VisitTrackingService } from './services/visit-tracking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'portfolio-template';

  constructor(private visitTracking: VisitTrackingService) {
    // Le service s'initialise automatiquement via son constructeur
  }

  ngOnInit(): void {
    // console.log('📊 Visit tracking activé');
  }
}
