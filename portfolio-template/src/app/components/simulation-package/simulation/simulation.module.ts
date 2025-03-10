import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


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
import { RouterModule, Routes } from '@angular/router';
import { PingSimulationsComponent } from '../ping-simulations/ping-simulations.component';
import { NetworkSimulationComponent } from '../network-simulation/network-simulation.component';
import { VlanSimulationComponent } from '../network-simulation/vlan-simulation/vlan-simulation.component';
import { IntroComponent } from '../network-simulation/vlan-simulation/intro/intro.component';
import { TerminalComponent } from '../network-simulation/vlan-simulation/terminal/terminal.component';
import { IntroEigrpComponent } from '../network-simulation/eigrp-simulation/intro/intro.component';
import { EigrpSimulationComponent } from '../network-simulation/eigrp-simulation/eigrp-simulation.component';
import { TerminalEigrpComponent } from '../network-simulation/eigrp-simulation/terminal-eigrp/terminal-eigrp.component';


const routes : Routes = [
  {path : '', component : PingSimulationsComponent},
  {path : '', component : NetworkSimulationComponent},
  {path : '', component : VlanSimulationComponent},
  {path : '', component : IntroComponent},
  {path : '', component : TerminalComponent},
  {path : '', component : IntroEigrpComponent},
  {path : '', component : EigrpSimulationComponent},
  {path : '', component : TerminalEigrpComponent}
];



@NgModule({
  declarations: [],
  imports: [
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
    RouterModule
  ]
})
export class SimulationModule { }
