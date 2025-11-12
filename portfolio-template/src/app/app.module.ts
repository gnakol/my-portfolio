import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './components/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { LoginModule } from './pages/authenticate/login/login.module';
import { ExperienceModule } from './components/experiences-package/experience.module';
import { AccountTemplateComponent } from './components/account-package/account-template/account-template.component';
import { AuthInterceptor } from './pages/authenticate/auth/interceptor/auth.interceptor';
import { VpnConfigurationComponent } from './components/simulation-package/security-simulations/vpn-configuration/vpn-configuration.component';
import { NetworkIntrusionComponent } from './components/simulation-package/security-simulations/network-intrusion/network-intrusion.component';
import { RadiusComponent } from './components/simulation-package/security-simulations/radius/radius.component';
import { ProtectSystemComponent } from './components/simulation-package/security-simulations/protect-system/protect-system.component';
import { AddMediaComponent } from './components/medias-package/web-service/add-media/add-media.component';
import { AllMediaComponent } from './components/medias-package/web-service/all-media/all-media.component';
@NgModule({
  declarations: [
    AppComponent,
    AccountTemplateComponent,
    VpnConfigurationComponent,
    NetworkIntrusionComponent,
    RadiusComponent,
    ProtectSystemComponent,
    AddMediaComponent,
    AllMediaComponent
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
    provideAnimationsAsync(),
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true,
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
