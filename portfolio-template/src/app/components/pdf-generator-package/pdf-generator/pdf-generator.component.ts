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
import { CommonModule } from '@angular/common';
//import { jsPDF } from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Créer une instance locale de pdfMake avec vfs défini
const pdfMakeInstance: any = { ...pdfMake };
pdfMakeInstance.vfs = pdfFonts?.pdfMake?.vfs || {};

if (!pdfMakeInstance.vfs) {
    // console.error('pdfMake.vfs est indéfini.');
}




@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.scss'],
  imports : [CommonModule]
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
  projects: Experience[] = [];
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
    this.loadDataAndGeneratePdf();
  }
  

  async loadDataAndGeneratePdf() {
    try {
      await Promise.all([
        this.loadExperience(),
        this.loadTraining(),
        this.loadSkill(),
        this.loadHobbies(), // Correction du typo "hobbies"
        this.loadLanguage(),
      ]);
      this.generatePdf(); // Ajout de cette ligne
    } catch (error) {
      // console.error("Erreur lors du chargement des données pour le PDF :", error);
    }
  }

  loadExperience(): Promise<void> {
    return new Promise((resolve) => {
      this.experienceService.getAllExperiences().subscribe((data) => {
        this.experiences = data.content.filter((exp) => exp.experienceType.name !== 'Projet');
        this.projects = data.content.filter((exp) => exp.experienceType.name === 'Projet');
        resolve();
      });
    });
  }

  loadTraining(): Promise<void> {
    return new Promise((resolve) => {
      this.trainingService.getAllTraining().subscribe((data) => {
        this.trainings = data.content;
        resolve();
      });
    });
  }

  loadSkill(): Promise<void> {
    return new Promise((resolve) => {
      this.skillService.getAllSkill().subscribe((data) => {
        this.skills = data.content;
        resolve();
      });
    });
  }

  loadHobbies(): Promise<void> {
    return new Promise((resolve) => {
      this.hobbiesService.allHobbies().subscribe((data) => {
        this.hobbies = data.content;
        resolve();
      });
    });
  }

  loadLanguage(): Promise<void> {
    return new Promise((resolve) => {
      this.languageService.allLanguage().subscribe((data) => {
        this.languages = data.content;
        resolve();
      });
    });
  }

  generatePdf(): void {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download('cv.pdf');
  }

  getDocumentDefinition() {
    return {
      content: [
        // Section Informations Personnelles
        { text: this.name, style: 'header' },
        { text: `Email : ${this.email}`, style: 'subheader' },
        { text: `LinkedIn : ${this.linkedinUrl}`, style: 'subheader' },
        { text: `GitHub : ${this.githubUrl}`, style: 'subheader' },
        { text: `Adresse : ${this.address}`, style: 'subheader' },
        { text: ' ', margin: [0, 5] }, // Espacement réduit
  
        // Deux colonnes
        {
          columns: [
            // Colonne de gauche
            [
              // Section Formations
              { text: 'Formations', style: 'sectionHeader' },
              ...this.trainings.map((training) => ({
                text: `${training.label} - ${training.diploma} (${training.yearOfObtaining})`,
                style: 'body',
              })),
              { text: ' ', margin: [0, 5] }, // Espacement réduit
  
              // Section Compétences
              { text: 'Compétences', style: 'sectionHeader' },
              ...this.skills.map((skill) => ({
                text: `${skill.name} : ${skill.description}`,
                style: 'body',
              })),
              { text: ' ', margin: [0, 5] }, // Espacement réduit
  
              // Section Langues
              { text: 'Langues', style: 'sectionHeader' },
              ...this.languages.map((language) => ({
                text: `${language.name} - ${language.proficiencyLevel}`,
                style: 'body',
              })),
              { text: ' ', margin: [0, 5] }, // Espacement réduit
  
              // Section Centres d'intérêt
              { text: 'Centres d\'intérêt', style: 'sectionHeader' },
              ...this.hobbies.map((hobby) => ({
                text: `${hobby.name} - ${hobby.description}`,
                style: 'body',
              })),
            ],
  
            // Colonne de droite
            [
              // Section Expériences Professionnelles
              { text: 'Expériences Professionnelles', style: 'sectionHeader' },
              ...this.experiences.map((exp) => ({
                text: `${exp.title} - ${exp.companyName} (${exp.startDate} - ${exp.endDate || 'Présent'})`,
                style: 'body',
              })),
              { text: ' ', margin: [0, 5] }, // Espacement réduit
  
              // Section Projets
              { text: 'Projets', style: 'sectionHeader' },
              ...this.projects.map((project) => ({
                text: `${project.title} : ${project.description}`,
                style: 'body',
              })),
            ],
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 20, // Taille réduite
          bold: true,
          color: '#4facfe',
          margin: [0, 0, 0, 5], // Marge réduite
        },
        subheader: {
          fontSize: 10, // Taille réduite
          margin: [0, 0, 0, 3], // Marge réduite
        },
        sectionHeader: {
          fontSize: 14, // Taille réduite
          bold: true,
          color: '#4facfe',
          margin: [0, 5, 0, 3], // Marge réduite
        },
        body: {
          fontSize: 10, // Taille réduite
          margin: [0, 0, 0, 3], // Marge réduite
        },
      },
    };
  }
}