import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AllExperienceComponent } from './web-service/all-experience/all-experience.component';
import { ReactiveFormsModule } from '@angular/forms';


// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Ajouté pour MatSnackBar
import { AddExperienceComponent } from './web-service/add-experience/add-experience.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { ExperienceTemplateComponent } from './experience-template/experience-template.component';
import { AllTypeExperienceComponent } from './web-service/all-type-experience/all-type-experience.component';
import { RemoveTypeExperienceComponent } from './web-service/remove-type-experience/remove-type-experience.component';
import { RemoveExperienceComponent } from './web-service/remove-experience/remove-experience.component';
import { AddTypeExperienceComponent } from './web-service/add-type-experience/add-type-experience.component';
import { ExperienceDetailComponent } from './experience-detail/experience-detail.component'; // ✅ Ajouté ici

const routes: Routes = [
  { path: '', component: AllExperienceComponent },
  { path: 'add', component: AddExperienceComponent},
  { path: '', component : ExperienceTemplateComponent},
  { path: 'all-experiences-type', component : AllTypeExperienceComponent },
  { path: 'add-experiences-type', component : AddTypeExperienceComponent},
  { path: '', component : ExperienceDetailComponent}
];

@NgModule({
  declarations: [
    AddExperienceComponent,
    RemoveTypeExperienceComponent,
    RemoveExperienceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule, // Ajouté ici
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatNativeDateModule
  
  ]
})
export class ExperienceModule { }
