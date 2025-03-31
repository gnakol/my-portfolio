import { NgModule } from '@angular/core';
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
import { AdminSimulationsComponent } from './components/simulation-package/admin-simulations/admin-simulations.component';
import { SecuritySimulationsComponent } from './components/simulation-package/security-simulations/security-simulations.component';
import { AuthInterceptor } from './pages/authenticate/auth/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AccountTemplateComponent,
    AdminSimulationsComponent,
    SecuritySimulationsComponent,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
