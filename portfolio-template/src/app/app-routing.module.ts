import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllExperienceComponent } from './components/experiences-package/web-service/all-experience/all-experience.component';
import { AllTrainingsComponent } from './components/training-package/web-services/all-trainings/all-trainings.component';
import { AllSkillComponent } from './components/skill-package/web-service/all-skill/all-skill.component';
import { AllHobbiesComponent } from './components/hobbies-package/web-service/all-hobbies/all-hobbies.component';
import { AllLanguagesComponent } from './components/language-package/web-service/all-languages/all-languages.component';
import { AuthComponent } from './pages/authenticate/auth/auth.component';
import { AddTrainingsComponent } from './components/training-package/web-services/add-trainings/add-trainings.component';
import { AddSkillComponent } from './components/skill-package/web-service/add-skill/add-skill.component';
import { AddHobbiesComponent } from './components/hobbies-package/web-service/add-hobbies/add-hobbies.component';
import { AddLanguagesComponent } from './components/language-package/web-service/add-languages/add-languages.component';
import { ExperienceTemplateComponent } from './components/experiences-package/experience-template/experience-template.component';
import { SkillTemplateComponent } from './components/skill-package/skill-template/skill-template.component';
import { TrainingTemplateComponent } from './components/training-package/training-template/training-template.component';
import { HobbieTemplateComponent } from './components/hobbies-package/hobbie-template/hobbie-template.component';
import { LanguageTemplateComponent } from './components/language-package/language-template/language-template.component';
import { DashboardComponent } from './components/admin-dashboard-package/dashboard-admin/dashboard.component';
import { AllEstablishmentComponent } from './components/establishment-package/web-service/all-establishment/all-establishment.component';
import { AddEstablishmentComponent } from './components/establishment-package/web-service/add-establishment/add-establishment.component';
import { AllSkillCategoryComponent } from './components/skill-package/web-service/all-skill-category/all-skill-category.component';
import { AddSkillCategoryComponent } from './components/skill-package/web-service/add-skill-category/add-skill-category.component';
import { PdfGeneratorComponent } from './components/pdf-generator-package/pdf-generator/pdf-generator.component';
import { SimulationDashboardComponent } from './components/simulation-package/simulation-dashboard/simulation-dashboard.component';
import { PingSimulationsComponent } from './components/simulation-package/ping-simulations/ping-simulations.component';
import { NetworkSimulationComponent } from './components/simulation-package/network-simulation/network-simulation.component';
import { VlanSimulationComponent } from './components/simulation-package/network-simulation/vlan-simulation/vlan-simulation.component';
import { IntroComponent } from './components/simulation-package/network-simulation/vlan-simulation/intro/intro.component';
import { TerminalComponent } from './components/simulation-package/network-simulation/vlan-simulation/terminal/terminal.component';
import { AllLogSecurityComponent } from './components/log-security-package/web-services/all-log-security/all-log-security.component';
import { IntroEigrpComponent } from './components/simulation-package/network-simulation/eigrp-simulation/intro/intro.component';
import { EigrpSimulationComponent } from './components/simulation-package/network-simulation/eigrp-simulation/eigrp-simulation.component';
import { TerminalEigrpComponent } from './components/simulation-package/network-simulation/eigrp-simulation/terminal-eigrp/terminal-eigrp.component';
import { DhcpComponent } from './components/simulation-package/network-simulation/dhcp/dhcp.component';
import { IntroDhcpComponent } from './components/simulation-package/network-simulation/dhcp/intro-dhcp/intro-dhcp.component';
import { RelayComponent } from './components/simulation-package/network-simulation/dhcp/relay/relay.component';
import { FullComponent } from './components/simulation-package/network-simulation/dhcp/full/full.component';
import { AuthGuard } from './pages/authenticate/protec-route/auth.guard';
import { ContactTemplateComponent } from './components/contact-package/contact-template/contact-template.component';
import { AllContactComponent } from './components/contact-package/web-service/all-contact/all-contact.component';
import { ExperienceDetailComponent } from './components/experiences-package/experience-detail/experience-detail.component';
import { AdminSimulationsComponent } from './components/simulation-package/admin-simulations/admin-simulations.component';
import { MigrationIntroComponent } from './components/simulation-package/admin-simulations/migration/migration-intro/migration-intro.component';
import { MigrationComponent } from './components/simulation-package/admin-simulations/migration/migration.component';
import { NetworkDiagramComponent } from './components/simulation-package/admin-simulations/migration/network-diagram/network-diagram.component';
import { MonitoringComponent } from './components/simulation-package/admin-simulations/monitoring/monitoring.component';
import { MonitoringCyberWarComponent } from './components/simulation-package/admin-simulations/monitoring/monitoring-cyber-war/monitoring-cyber-war.component';
import { SecuritySimulationsComponent } from './components/simulation-package/security-simulations/security-simulations.component';
import { IntroFirewallComponent } from './components/simulation-package/security-simulations/firewall-attack-blocker/intro-firewall/intro-firewall.component';
import { GoSimulationFirewallComponent } from './components/simulation-package/security-simulations/firewall-attack-blocker/go-simulation-firewall/go-simulation-firewall.component';
import { FirewallAttackBlockerComponent } from './components/simulation-package/security-simulations/firewall-attack-blocker/firewall-attack-blocker.component';
import { MonitoringIntroComponent } from './components/simulation-package/admin-simulations/monitoring/monitoring-intro/monitoring-intro.component';
import { SkillCategoriesComponent } from './components/skill-package/web-service/skill-categories/skill-categories.component';
import { ProfileComponent } from './components/admin-dashboard-package/profle-template/profile/profile.component';
import { ProjectTemplateComponent } from './components/project-package/project-template/project-template.component';
import { AddProjectTypeComponent } from './components/project-package/web-service/add-project-type/add-project-type.component';
import { AllProjectTypeComponent } from './components/project-package/web-service/all-project-type/all-project-type.component';
import { AllProjectComponent } from './components/project-package/web-service/all-project/all-project.component';
import { AddProjectComponent } from './components/project-package/web-service/add-project/add-project.component';
import { MissionControlComponent } from './components/monitoring/mission-control/mission-control.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'cv', loadChildren: () => import('./pages/cv/cv.module').then(m => m.CvModule) },
  { path: 'simulations', loadChildren: () => import('./pages/simulations/simulations.module').then(m => m.SimulationsModule) },
  { path: 'blog', loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule) },
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
  { path: 'admin-dashboard', loadChildren: () => import('./components/admin-dashboard-package/admin/admin.module').then(m => m.AdminModule), canActivate : [AuthGuard]},

  // 🔥 Nouvelle route pour afficher les expériences
  { path: 'experiences', component: AllExperienceComponent },

  { path: 'trainings', component: AllTrainingsComponent },
  { path: 'skills', component: AllSkillComponent},
  { path: 'skills/category/:id', component: AllSkillComponent },
  { path: 'skills-categories', component : SkillCategoriesComponent},
  { path: 'projects', component: AllProjectComponent},
  { path: 'hobbies', component: AllHobbiesComponent},
  { path: 'languages', component : AllLanguagesComponent},
  { path: 'all-establishment', component : AllEstablishmentComponent},
  { path: 'all-skill-category', component : AllSkillCategoryComponent},
  { path: 'all-log-security', component : AllLogSecurityComponent, canActivate : [AuthGuard]},
  { path: 'contacts', component : AllContactComponent, canActivate : [AuthGuard]},
  { path: 'all-project-types', component : AllProjectTypeComponent},

  // Deatil

  { path: 'experience-detail/:id', component : ExperienceDetailComponent},




  { path: 'login', component : AuthComponent},
  { path: 'dashboard-admin', component : DashboardComponent, canActivate : [AuthGuard]},
  { path: 'profile', component : ProfileComponent, canActivate : [AuthGuard]},
  { path: '0a13f9e4-👁️-simulation-🛡️-network-bf1926', component : SimulationDashboardComponent},
  { path: 'network-simulation', component : NetworkSimulationComponent},
  { path: 'vlan-simulation', component : VlanSimulationComponent},
  { path: 'eigrp-simulation', component : EigrpSimulationComponent},
  { path: 'dhcp-simulation', component : DhcpComponent},
  { path: 'admin-simulation', component : AdminSimulationsComponent},
  { path: 'migration-simulation', component : MigrationComponent},
  { path: 'monitoring-simulation', component : MonitoringComponent},
  { path: 'firewall-blocked-simulation', component : FirewallAttackBlockerComponent},



  { path: 'add-training', component : AddTrainingsComponent, canActivate : [AuthGuard]},
  { path: 'add-skill', component : AddSkillComponent, canActivate : [AuthGuard]},
  { path: 'add-hobbie', component : AddHobbiesComponent, canActivate : [AuthGuard]},
  { path: 'add-language', component : AddLanguagesComponent, canActivate : [AuthGuard]}, 
  { path: 'add-establishment', component : AddEstablishmentComponent, canActivate : [AuthGuard]},
  { path: 'add-skill-category', component : AddSkillCategoryComponent, canActivate : [AuthGuard]},
  { path: 'add-project-type', component : AddProjectTypeComponent, canActivate : [AuthGuard]},
  { path: 'add-project', component : AddProjectComponent, canActivate : [AuthGuard]},

  { path: 'experience-template', component : ExperienceTemplateComponent, canActivate : [AuthGuard]},
  { path: 'skill-template', component : SkillTemplateComponent, canActivate : [AuthGuard]},
  { path: 'training-template', component : TrainingTemplateComponent, canActivate : [AuthGuard]},
  { path: 'hobbie-template', component : HobbieTemplateComponent, canActivate : [AuthGuard]},
  { path: 'language-template', component : LanguageTemplateComponent, canActivate : [AuthGuard]},
  { path: 'contact-template', component : ContactTemplateComponent, canActivate : [AuthGuard]},
  { path: 'project-template', component : ProjectTemplateComponent, canActivate : [AuthGuard]},

  { path: 'pdf-generator', component : PdfGeneratorComponent},

  // Simulation

  {path: 'ping-simulation', component : PingSimulationsComponent},



  // For vlan
  { path : 'intro-vlan', component : IntroComponent},
  { path : 'intro-migration', component : MigrationIntroComponent},
  { path : 'intro-monitoring', component : MonitoringIntroComponent},
  { path : 'terminal-vlan-config', component : TerminalComponent},

  // For eigrp
  { path : 'terminal-eigrp-config', component : TerminalEigrpComponent},
  { path : 'intro-eigrp', component : IntroEigrpComponent},


  //For DHCP
  { path : 'intro-dhcp-config', component : IntroDhcpComponent},
  { path: 'dhcp-relay', component: RelayComponent },
  { path: 'dhcp-full', component: FullComponent },

  { path: 'migration-network-diagram', component : NetworkDiagramComponent},
  { path: 'monitoring-start', component : MonitoringCyberWarComponent}, 

  //For Security

  { path : 'security-template', component : SecuritySimulationsComponent},
  { path : 'intro-firewall', component : IntroFirewallComponent},
  { path : 'go-firewal-simulation', component : GoSimulationFirewallComponent},
  { path: 'mission-control', component: MissionControlComponent }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration : 'enabled',
    anchorScrolling : 'enabled',
    onSameUrlNavigation : 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
