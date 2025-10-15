import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Nos composants
import { CvComponent } from './cv/cv.component';
import { AllExperienceComponent } from '../../components/experiences-package/web-service/all-experience/all-experience.component';
import { AllTrainingsComponent } from '../../components/training-package/web-services/all-trainings/all-trainings.component';
import { SkillCategoriesComponent } from '../../components/skill-package/web-service/skill-categories/skill-categories.component';
import { AllProjectComponent } from '../../components/project-package/web-service/all-project/all-project.component';
import { AllHobbiesComponent } from '../../components/hobbies-package/web-service/all-hobbies/all-hobbies.component';
import { AllLanguagesComponent } from '../../components/language-package/web-service/all-languages/all-languages.component';
import { CvShellComponent } from './shell/cv-shell/cv-shell.component';
import { AllSkillComponent } from '../../components/skill-package/web-service/all-skill/all-skill.component';

const routes: Routes = [
  {
    path: '',
    component: CvShellComponent, // 🧩 notre layout principal
    children: [
      { path: '', component: CvComponent }, // /cv
      { path: 'experiences', component: AllExperienceComponent },
      { path: 'trainings', component: AllTrainingsComponent },
      { path: 'skills-categories', component: SkillCategoriesComponent },
      { path: 'projects', component: AllProjectComponent },
      { path: 'hobbies', component: AllHobbiesComponent },
      { path: 'languages', component: AllLanguagesComponent },
      { path: 'skills', component: AllSkillComponent },
      { path: 'skills/category/:id', component: AllSkillComponent },

    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CvModule {}
