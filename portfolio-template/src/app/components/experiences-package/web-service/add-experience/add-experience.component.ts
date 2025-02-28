import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { experienceTypeService } from '../../../../services/experience_type.service';
import { ExperienceService } from '../../../../services/experience.service';

@Component({
  selector: 'app-experience-form',
  standalone: false,
  templateUrl: './add-experience.component.html',
  styleUrl: './add-experience.component.scss'
})
export class AddExperienceComponent implements OnInit {

  experienceForm: FormGroup;
  
  experienceTypes: any[] = []; // Liste des types d'expérience

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private experienceTypeService: experienceTypeService,
    private experienceService: ExperienceService
  ) {
    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      companyName: ['', Validators.required],
      experienceType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadExperienceTypes();
  }

  // Charger les types d'expérience
  loadExperienceTypes(): void {
    this.experienceTypeService.getAllExperienceTypes().subscribe(
      (data) => {
        this.experienceTypes = data;
      },
      (error) => {
        this.snackBar.open('Erreur lors du chargement des types d\'expérience.', 'Fermer', {
          duration: 3000,
        });
      }
    );
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.experienceForm.valid) {
      const experienceData = this.experienceForm.value;
      this.experienceService.createExperience(experienceData).subscribe(
        (response) => {
          this.snackBar.open('Expérience enregistrée avec succès !', 'Fermer', {
            duration: 3000,
          });
          this.experienceForm.reset();
        },
        (error) => {
          this.snackBar.open('Erreur lors de l\'enregistrement de l\'expérience.', 'Fermer', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir correctement le formulaire.', 'Fermer', {
        duration: 3000,
      });
    }
  }
}