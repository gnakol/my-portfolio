import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Experience } from '../../experiences-package/experience.model';
import { Training } from '../../training-package/training.model';
import { Skill } from '../../skill-package/skill.model';
import { Hobbies } from '../../hobbies-package/hobbies.model';
import { Language } from '../../language-package/language.model';
import { ExperienceService } from '../../../services/experience.service';
import { TrainingService } from '../../../services/training.service';
import { SkillService } from '../../../services/skill.service';
import { HobbiesService } from '../../../services/hobbies.service';
import { LanguageService } from '../../../services/language.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.scss'],
  imports: [CommonModule]
})
export class PdfGeneratorComponent implements OnInit {

  // Informations personnelles
  name: string = "N'GNA KOLIE";
  email: string = "gna.kolie@yahoo.fr";
  linkedinUrl: string = "https://linkedin.com/in/ngnakolie";
  githubUrl: string = "https://github.com/ngnakolie";
  address: string = "10 rue Utrillo, Arras";

  // Données dynamiques du CV
  experiences: Experience[] = [];
  projects: Experience[] = []; // 🚨 Ajout du tableau pour les projets
  trainings: Training[] = [];
  skills: Skill[] = [];
  hobbies: Hobbies[] = [];
  languages: Language[] = [];

  constructor(
    private router: Router,
    private experienceService: ExperienceService,
    private trainingService: TrainingService,
    private skillService: SkillService,
    private hobbiesService: HobbiesService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Charger toutes les données avant de générer le PDF
    this.loadDataAndGeneratePdf();
  }

  async loadDataAndGeneratePdf() {
    try {
      await Promise.all([
        this.loadExperience(),
        this.loadTraining(),
        this.loadSkill(),
        this.loadHobbies(),
        this.loadLanguage()
      ]);

      setTimeout(() => {
        this.generatePdf();
      }, 500); // Petit délai pour s'assurer que tout est bien rendu

    } catch (error) {
      console.error("Erreur lors du chargement des données pour le PDF :", error);
    }
  }

  loadExperience(): Promise<void> {
    return new Promise((resolve) => {
      this.experienceService.getAllExperiences().subscribe(data => {
        this.experiences = data.content.filter(exp => exp.experienceType.name !== 'Projet'); // 🎯 Exclure les projets
        this.projects = data.content.filter(exp => exp.experienceType.name === 'Projet'); // 🎯 Récupérer uniquement les projets
        resolve();
      });
    });
  }

  // Les autres méthodes restent inchangées
  loadTraining(): Promise<void> {
    return new Promise((resolve) => {
      this.trainingService.getAllTraining().subscribe(data => {
        this.trainings = data.content;
        resolve();
      });
    });
  }

  loadSkill(): Promise<void> {
    return new Promise((resolve) => {
      this.skillService.getAllSkill().subscribe(data => {
        this.skills = data.content;
        resolve();
      });
    });
  }

  loadHobbies(): Promise<void> {
    return new Promise((resolve) => {
      this.hobbiesService.allHobbies().subscribe(data => {
        this.hobbies = data.content;
        resolve();
      });
    });
  }

  loadLanguage(): Promise<void> {
    return new Promise((resolve) => {
      this.languageService.allLanguage().subscribe(data => {
        this.languages = data.content;
        resolve();
      });
    });
  }

  generatePdf(): void {
    const element = document.getElementById('pdf-content');

    if (element) {
      html2canvas(element, { scale: 2, logging: false }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.4); // JPEG avec qualité 40%

        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          compress: true // Activer la compression interne
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');
        pdf.save('cv.pdf');

        this.router.navigate(['/cv']); // Retourner à la page CV après le téléchargement
      }).catch(error => {
        console.error("Erreur lors de la génération du PDF :", error);
      });
    }
  }

}
