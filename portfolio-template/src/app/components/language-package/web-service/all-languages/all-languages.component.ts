import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LanguageService } from '../../../../services/language.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';

@Component({
  selector: 'app-all-languages',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
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
  languages: any[] = [];
  loading = true;

  constructor(
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
    private authService : AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.languageService.allLanguage().subscribe({
      next: (data) => {
        this.languages = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des langues :', err);
        this.snackBar.open('Impossible de charger les langues', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getFlagIcon(languageName: string): string {
    const flags: Record<string, string> = {
      'Français': '/assets/images/flags/fr.svg',
      'Anglais': 'assets/images/flags/gb.svg',
      'Espagnol': 'assets/images/flags/es.svg',
      'Allemand': 'assets/images/flags/de.svg',
      'Italien': 'assets/images/flags/it.svg',
      'Chinois': 'assets/images/flags/cn.svg',
      'Japonais': 'assets/images/flags/jp.svg',
      'Arabe': 'assets/images/flags/sa.svg'
    };

    return flags[languageName] || 'assets/images/flags/unknown.svg';
  }

  getProficiencyWidth(level: string): number {
    const levels: Record<string, number> = {
      'Débutant': 30,
      'Intermédiaire': 60,
      'Avancé': 80,
      'Courant': 95,
      'Bilingue': 100
    };

    return levels[level] || 50;
  }

  deleteLanguage(id: number): void {
    this.languageService.deleteLanguage(id).subscribe({
      next: () => {
        this.snackBar.open('Langue supprimée avec succès !', 'Fermer', { duration: 3000 });
        this.languages = this.languages.filter(lang => lang.idLanguage !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
      }
    });
  }

  isAdmin() : boolean
  {
    return this.authService.isAdmin();
  }
}