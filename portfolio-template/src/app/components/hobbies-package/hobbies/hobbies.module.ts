import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllHobbiesComponent } from '../web-service/all-hobbies/all-hobbies.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


const routes: Routes = [
  { path: '', component: AllHobbiesComponent }
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
export class HobbiesModule { }
