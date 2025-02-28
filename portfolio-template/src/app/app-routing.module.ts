import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllExperienceComponent } from './components/experiences-package/web-service/all-experience/all-experience.component';
import { AllTrainingsComponent } from './components/training-package/web-services/all-trainings/all-trainings.component';
import { AllSkillComponent } from './components/skill-package/web-service/all-skill/all-skill.component';
import { AllProjectsComponent } from './components/project-package/web-service/all-project/all-project.component';
import { AllHobbiesComponent } from './components/hobbies-package/web-service/all-hobbies/all-hobbies.component';
import { AllLanguagesComponent } from './components/language-package/web-service/all-languages/all-languages.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuthComponent } from './pages/authenticate/auth/auth.component';
import { AddExperienceComponent } from './components/experiences-package/web-service/add-experience/add-experience.component';
import { AddTrainingsComponent } from './components/training-package/web-services/add-trainings/add-trainings.component';
import { AddSkillComponent } from './components/skill-package/web-service/add-skill/add-skill.component';
import { AddHobbiesComponent } from './components/hobbies-package/web-service/add-hobbies/add-hobbies.component';
import { AddLanguagesComponent } from './components/language-package/web-service/add-languages/add-languages.component';
import { ExperienceTemplateComponent } from './components/experiences-package/experience-template/experience-template.component';
import { SkillTemplateComponent } from './components/skill-package/skill-template/skill-template.component';
import { TrainingTemplateComponent } from './components/training-package/training-template/training-template.component';
import { HobbieTemplateComponent } from './components/hobbies-package/hobbie-template/hobbie-template.component';
import { LanguageTemplateComponent } from './components/language-package/language-template/language-template.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'cv', loadChildren: () => import('./pages/cv/cv.module').then(m => m.CvModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'simulations', loadChildren: () => import('./pages/simulations/simulations.module').then(m => m.SimulationsModule) },
  { path: 'blog', loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule) },
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
  { path: 'admin-dashboard', loadChildren: () => import('./components/admin-dashboard-package/admin/admin.module').then(m => m.AdminModule)},

  // 🔥 Nouvelle route pour afficher les expériences
  { path: 'experiences', component: AllExperienceComponent },

  { path: 'trainings', component: AllTrainingsComponent },
  { path: 'skills', component: AllSkillComponent},
  { path: 'projects', component: AllProjectsComponent},
  { path: 'hobbies', component: AllHobbiesComponent},
  { path: 'languages', component : AllLanguagesComponent},
  { path: 'admin', component : AuthComponent},
  { path: 'dashboard-admin', component : DashboardComponent},


  { path: 'add-training', component : AddTrainingsComponent},
  { path: 'add-skill', component : AddSkillComponent},
  { path: 'add-hobbie', component : AddHobbiesComponent},
  { path: 'add-language', component : AddLanguagesComponent}, 

  { path: 'experience-template', component : ExperienceTemplateComponent},
  { path: 'skill-template', component : SkillTemplateComponent},
  { path: 'training-template', component : TrainingTemplateComponent},
  { path: 'hobbie-template', component : HobbieTemplateComponent},
  { path: 'language-template', component : LanguageTemplateComponent}
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
