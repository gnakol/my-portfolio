import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { AllLanguagesComponent } from '../web-service/all-languages/all-languages.component';

const routes: Routes = [
  { path: '', component: AllLanguagesComponent }
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
