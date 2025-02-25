import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { AllSkillComponent } from '../web-service/all-skill/all-skill.component';

const routes: Routes = [
  { path: '', component: AllSkillComponent }
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
export class SkillModule { }
