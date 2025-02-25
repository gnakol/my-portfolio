import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './components/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AllTrainingsComponent } from './components/training-package/web-services/all-trainings/all-trainings.component';
import { AddTrainingsComponent } from './components/training-package/web-services/add-trainings/add-trainings.component';
import { AllEstablishmentComponent } from './components/establishment-package/web-service/all-establishment/all-establishment.component';
import { AddEstablishmentComponent } from './components/establishment-package/web-service/add-establishment/add-establishment.component';
import { AllSkillComponent } from './components/skill-package/web-service/all-skill/all-skill.component';
import { AddSkillComponent } from './components/skill-package/web-service/add-skill/add-skill.component';
import { RemoveProjectComponent } from './components/project-package/web-service/remove-project/remove-project.component';
import { AllHobbiesComponent } from './components/hobbies-package/web-service/all-hobbies/all-hobbies.component';
import { AddHobbiesComponent } from './components/hobbies-package/web-service/add-hobbies/add-hobbies.component';
import { AllLanguagesComponent } from './components/language-package/web-service/all-languages/all-languages.component';
import { AddLanguagesComponent } from './components/language-package/web-service/add-languages/add-languages.component';

@NgModule({
  declarations: [
    AppComponent,
    AllEstablishmentComponent,
    AddEstablishmentComponent,
    AddSkillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
