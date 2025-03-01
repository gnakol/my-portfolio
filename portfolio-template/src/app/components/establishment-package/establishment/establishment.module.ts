import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AllEstablishmentComponent } from '../web-service/all-establishment/all-establishment.component';
import { AddEstablishmentComponent } from '../web-service/add-establishment/add-establishment.component';


const routes : Routes = [
  {path : '', component : AllEstablishmentComponent},
  { path: '', component : AddEstablishmentComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class EstablishmentModule { }
