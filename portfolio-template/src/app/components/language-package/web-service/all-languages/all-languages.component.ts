import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Language } from '../../language.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../../services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-languages',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './all-languages.component.html',
  styleUrls: ['./all-languages.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllLanguagesComponent implements OnInit {
  languages: Language[] = [];
  loading = true;

  constructor(
    private languageService: LanguageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.languageService.allLanguage().subscribe({
      next: (data) => {
        this.languages = data.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des langues :', err);
        this.snackBar.open('Impossible de charger les langues.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  

  deleteLanguage(id: number): void {
    this.languageService.deleteLanguage(id).subscribe({
      next: () => {
        this.languages = this.languages.filter(lang => lang.idLanguage !== id);
        this.snackBar.open('Langue supprimée avec succès !', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }
}
