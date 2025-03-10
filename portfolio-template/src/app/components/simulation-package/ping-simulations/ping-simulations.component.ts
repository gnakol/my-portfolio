import { Component } from '@angular/core';
import { SimulationService } from '../services/simulation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
import { MatNativeDateModule } from '@angular/material/core'; // ✅ Ajouté ici
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ping-simulations',
  templateUrl: './ping-simulations.component.html',
  imports : [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule, 
    MatSelectModule,
    MatNativeDateModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./ping-simulations.component.scss']
})
export class PingSimulationsComponent {

  ipAddress: string = '';

  pingResult: string = '';

  constructor(private simulationService: SimulationService) {}

  testPing() {
    if (!this.ipAddress) {
        this.pingResult = 'Veuillez entrer une adresse IP valide.';
        return;
    }

    // Nettoie l'adresse IP pour éviter les erreurs de commande
    const cleanedIpAddress = this.ipAddress.trim().replace(/^ping\s+/i, '');

    this.pingResult = 'En cours de test...';

    this.simulationService.executePing(cleanedIpAddress).subscribe(
        (response) => {
            console.log('🟢 Réponse du backend : ', response);
            this.pingResult = response.expectedResult || 'Aucun résultat retourné.';
            this.ipAddress = '';
        },
        (error) => {
            console.error('🔴 Erreur lors de la requête : ', error);
            this.pingResult = 'Erreur : ' + error.message;
            this.ipAddress = '';
        }
    );
}



}
