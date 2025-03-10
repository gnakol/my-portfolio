import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AllLogSecurityComponent } from '../web-services/all-log-security/all-log-security.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes : Routes  = [
  {path : '', component : AllLogSecurityComponent}
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LogSecurityModule { }
