import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { AllLanguagesComponent } from '../web-service/all-languages/all-languages.component';
import { AddLanguagesComponent } from '../web-service/add-languages/add-languages.component';
import { LanguageTemplateComponent } from '../language-template/language-template.component';

const routes: Routes = [
  { path: '', component: AllLanguagesComponent },
  { path: '', component: AddLanguagesComponent},
  { path: '', component: LanguageTemplateComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatCardModule
  ]
})
export class LanguagesModule { }
