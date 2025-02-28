import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './components/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AllEstablishmentComponent } from './components/establishment-package/web-service/all-establishment/all-establishment.component';
import { AddEstablishmentComponent } from './components/establishment-package/web-service/add-establishment/add-establishment.component';
import { MatCardModule } from '@angular/material/card';
import { LoginModule } from './pages/authenticate/login/login.module';
import { ExperienceModule } from './components/experiences-package/experience.module';

@NgModule({
  declarations: [
    AppComponent,
    AllEstablishmentComponent,
    AddEstablishmentComponent
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
