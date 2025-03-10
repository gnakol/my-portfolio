import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule

  ]
})
export class AnimationComponent implements OnChanges {
  
  @Input() animationType: string = '';
  
  // Définir les états visuels des PCs du réseau
  networkState: { [key: string]: string } = {
    pc1: 'default',
    pc2: 'default',
    pc3: 'default',
    pc4: 'default',
    switch: 'default'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animationType']) {
      this.runAnimation(changes['animationType'].currentValue);
    }
  }

  runAnimation(animationType: string) {
    console.log(`🎬 Lancement de l'animation : ${animationType}`);
    this.resetNetworkState();

    switch (animationType) {
      case 'vlan10Created':
        this.networkState['pc1'] = 'vlan10';
        this.networkState['pc2'] = 'vlan10';
        break;
      case 'vlan20Created':
        this.networkState['pc3'] = 'vlan20';
        this.networkState['pc4'] = 'vlan20';
        break;
      case 'port1Selected':
        this.networkState['switch'] = 'port1Selected';
        break;
      case 'modeAccessSet':
        this.networkState['switch'] = 'modeAccess';
        break;
      case 'vlan10Assigned':
        this.networkState['pc1'] = 'vlan10';
        this.networkState['switch'] = 'vlan10';
        break;
      default:
        console.warn(`⚠️ Aucune animation définie pour : ${animationType}`);
        break;
    }
}


  resetNetworkState() {
    this.networkState = {
      pc1: 'default',
      pc2: 'default',
      pc3: 'default',
      pc4: 'default',
      switch: 'default'
    };
  }
}
