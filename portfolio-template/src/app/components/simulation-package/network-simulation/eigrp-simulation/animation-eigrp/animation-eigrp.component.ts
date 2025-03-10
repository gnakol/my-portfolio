import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-animation-eigrp',
  templateUrl: './animation-eigrp.component.html',
  styleUrls: ['./animation-eigrp.component.scss'],
  imports : [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class AnimationEigrpComponent implements OnChanges {

  @Input() animationType: string = '';

  // Définir les états visuels des équipements réseau
  networkState: { [key: string]: string } = {
    router: 'default',
    network1: 'default',
    network2: 'default',
    pc1: 'default',
    pc2: 'default'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animationType']) {
      this.runAnimation(changes['animationType'].currentValue);
    }
  }

  runAnimation(animationType: string) {
    console.log(`🎬 Lancement de l'animation EIGRP : ${animationType}`);
    this.resetNetworkState();

    switch (animationType) {
      case 'eigrpActivated':
        this.networkState['router'] = 'eigrp';
        break;
      case 'networkAdded1':
        this.networkState['network1'] = 'connected';
        this.networkState['pc1'] = 'active';
        break;
      case 'networkAdded2':
        this.networkState['network2'] = 'connected';
        this.networkState['pc2'] = 'active';
        break;
      case 'showRoutes':
        this.networkState['router'] = 'routesVisible';
        break;
      case 'pingSuccess':
        this.networkState['pc1'] = 'pinging';
        this.networkState['pc2'] = 'pingSuccess';
        break;
      default:
        console.warn(`⚠️ Aucune animation définie pour : ${animationType}`);
        break;
    }
}


  resetNetworkState() {
    this.networkState = {
      router: 'default',
      network1: 'default',
      network2: 'default',
      pc1: 'default',
      pc2: 'default'
    };
  }
}
