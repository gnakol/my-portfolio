import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AllTrainingsComponent } from '../web-services/all-trainings/all-trainings.component';

const routes: Routes = [
  { path: '', component: AllTrainingsComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class TrainingModule { }
