import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntroDhcpComponent } from './intro-dhcp/intro-dhcp.component';

@Component({
  selector: 'app-dhcp',
  templateUrl: './dhcp.component.html',
  styleUrls: ['./dhcp.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IntroDhcpComponent
  ]
})
export class DhcpComponent {
  selectedConfig: 'relay' | 'full' | null = null;

  chooseConfig(configType: 'relay' | 'full') {
    this.selectedConfig = configType;
  }

  resetChoice() {
    this.selectedConfig = null; // 🔥 Permet de revenir à l'écran de choix
  }
}
