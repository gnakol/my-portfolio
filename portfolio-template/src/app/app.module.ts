import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './components/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { LoginModule } from './pages/authenticate/login/login.module';
import { ExperienceModule } from './components/experiences-package/experience.module';
import { AccountTemplateComponent } from './components/account-package/account-template/account-template.component';
import { AdminSimulationsComponent } from './components/simulation-package/admin-simulations/admin-simulations.component';
import { SecuritySimulationsComponent } from './components/simulation-package/security-simulations/security-simulations.component';
import { DhcpComponent } from './components/simulation-package/network-simulation/dhcp/dhcp.component';
import { RelayComponent } from './components/simulation-package/network-simulation/dhcp/relay/relay.component';
import { FullComponent } from './components/simulation-package/network-simulation/dhcp/full/full.component';
import { IntroDhcpComponent } from './components/simulation-package/network-simulation/dhcp/intro-dhcp/intro-dhcp.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountTemplateComponent,
    AdminSimulationsComponent,
    SecuritySimulationsComponent,
    DhcpComponent,
    RelayComponent,
    FullComponent,
    IntroDhcpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    SharedModule,
    HttpClientModule,
    MatCardModule,
    LoginModule,
    ExperienceModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
