import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericMethodeService } from './generic-methode.service';
import { Contact, ContactResponse } from '../components/contact-package/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private contactUrl = 'http://localhost:9000/portfolio-api/contact';

  constructor(
    private http: HttpClient,
    private genericMethodeService: GenericMethodeService
  ) {}

  allContact(page: number = 0, size: number = 10): Observable<ContactResponse> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<ContactResponse>(`${this.contactUrl}/all-contact?page=${page}&size=${size}`, {headers});
  }

  /**
   * ✅ Récupérer un contact par ID
   */
  contactById(id: number): Observable<Contact> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.get<Contact>(`${this.contactUrl}/get-contact-by-id/${id}`, { headers });
  }

  /**
   * ✅ Ajouter un nouveau contact
   */
  createContact(contactData: any): Observable<any> {
    return this.http.post(`${this.contactUrl}/add-new-contact`, contactData, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // Ne pas inclure d'Authorization header
        })
    });
}

  deleteContact(id: number): Observable<any> {
    const headers = this.genericMethodeService.getHeaders();
    return this.http.delete(`${this.contactUrl}/remove-contact/${id}`, {
      headers,
      responseType: 'text' as 'json'
    });
  }
  
}