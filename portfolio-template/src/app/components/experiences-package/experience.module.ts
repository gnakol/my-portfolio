import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AllExperienceComponent } from './web-service/all-experience/all-experience.component';
import { AddExperienceComponent } from './web-service/add-experience/add-experience.component'

const routes: Routes = [
  { path: '', component: AllExperienceComponent }
];

@NgModule({
  declarations: [
    AddExperienceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ExperienceModule { }
