import { Component } from '@angular/core';
import { IntroFirewallComponent } from './intro-firewall/intro-firewall.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-firewall-attack-blocker',
  standalone: true,
  templateUrl: './firewall-attack-blocker.component.html',
  styleUrl: './firewall-attack-blocker.component.scss',
  imports : [
    IntroFirewallComponent,
    CommonModule,
    ReactiveFormsModule,
    
  ]
})
export class FirewallAttackBlockerComponent {

  showIntroFirewall: boolean = true;

  onStartSimulation() {
    this.showIntroFirewall = false;
  }

}
