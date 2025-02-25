import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvComponent } from './cv/cv.component';
import { RouterModule, Routes } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



const routes: Routes = [
  { path: '', component: CvComponent }
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule
  ]
})
export class CvModule { }
