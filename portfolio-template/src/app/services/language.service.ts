import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language, LanguageResponse } from '../components/language-package/language.model';
import { GenericMethodeService } from './generic-methode.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageUrl = `${environment.apiBaseUrl}/language`;

  constructor(private http: HttpClient, private genericMethodeService: GenericMethodeService) {}

  allLanguage(page: number = 0, size: number = 10): Observable<{ content: Language[] }> {

    //const headers = this.genericMethodeService.getHeaders();
    
    return this.http.get<{ content: Language[] }>(`${this.languageUrl}/all-language?page=${page}&size=${size}`);
  }

  languageById(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.languageUrl}/get-by-id-language/${id}`);
  }

  createLanguage(languageData: any): Observable<any> {
    const headers = this.genericMethodeService.getHeaders(); // ✅ Ajout des headers JWT
    return this.http.post(`${this.languageUrl}/add-language`, languageData, { headers });
  }

  deleteLanguage(id: number): Observable<any> {

    const headers = this.genericMethodeService.getHeaders();

    return this.http.delete(`${this.languageUrl}/remove-language/${id}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }
}
