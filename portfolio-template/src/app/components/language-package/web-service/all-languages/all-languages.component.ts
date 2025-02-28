import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Language } from '../../language.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-all-languages',
  standalone: true,
  imports: [
    CommonModule,
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
  languages: Language[] = [];
  loading = true;

  constructor(private languageService: LanguageService) {}

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
        this.loading = false;
      }
    });
  }
}
