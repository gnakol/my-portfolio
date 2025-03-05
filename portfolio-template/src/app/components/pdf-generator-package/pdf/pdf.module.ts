import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

const routes : Routes = [
  {path : '', component : PdfGeneratorComponent}
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PdfModule { }
