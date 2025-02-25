import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../components/language-package/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageUrl = 'http://localhost:9000/portfolio-api/language';

  constructor(private http: HttpClient) {}

  allLanguage(page: number = 0, size: number = 10): Observable<{ content: Language[] }> {
    return this.http.get<{ content: Language[] }>(`${this.languageUrl}/all-language?page=${page}&size=${size}`);
  }

  languageById(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.languageUrl}/get-by-id-language/${id}`);
  }

  getLanguage(id: number): Observable<{ id: number; name: string; city: string }> {
    return this.http.get<{ id: number; name: string; city: string }>(`${this.languageUrl}/get-by-id-language/${id}`);
  }
}
