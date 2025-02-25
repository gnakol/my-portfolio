import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllExperienceComponent } from './components/experiences-package/web-service/all-experience/all-experience.component';
import { AllTrainingsComponent } from './components/training-package/web-services/all-trainings/all-trainings.component';
import { AllSkillComponent } from './components/skill-package/web-service/all-skill/all-skill.component';
import { AllProjectsComponent } from './components/project-package/web-service/all-project/all-project.component';
import { AllHobbiesComponent } from './components/hobbies-package/web-service/all-hobbies/all-hobbies.component';
import { AllLanguagesComponent } from './components/language-package/web-service/all-languages/all-languages.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'cv', loadChildren: () => import('./pages/cv/cv.module').then(m => m.CvModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'simulations', loadChildren: () => import('./pages/simulations/simulations.module').then(m => m.SimulationsModule) },
  { path: 'blog', loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule) },
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },

  // 🔥 Nouvelle route pour afficher les expériences
  { path: 'experiences', component: AllExperienceComponent },
  { path: 'trainings', component: AllTrainingsComponent },
  { path: 'skills', component: AllSkillComponent},
  { path: 'projects', component: AllProjectsComponent},
  { path: 'hobbies', component: AllHobbiesComponent},
  { path: 'languages', component : AllLanguagesComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
