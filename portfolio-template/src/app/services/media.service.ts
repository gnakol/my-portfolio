import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MediaDTO {
  mediaId: number;
  accountId: number;
  mediaType: string; // "image", "video", "lab", "schema reseau", "demo vlan"
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  caption?: string;
  featured: boolean;
  orderIndex?: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private mediaUrl = `${environment.apiBaseUrl}/media`;

  constructor(private http: HttpClient) {}

  /**
   * Upload d'un nouveau média
   *
   * @param file Le fichier à uploader
   * @param mediaType Type initial (image ou video)
   * @param accountId ID du compte
   * @returns Observable<MediaDTO>
   */
  uploadMedia(file: File, mediaType: string, accountId: number): Observable<MediaDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType);
    formData.append('accountId', accountId.toString());

    return this.http.post<MediaDTO>(`${this.mediaUrl}/upload`, formData);
  }

  /**
   * Tag un média existant (lab, schema reseau, demo vlan)
   * DÉCLENCHE LA PERSISTANCE AWS
   *
   * @param mediaId ID du média
   * @param tag Tag à appliquer
   * @returns Observable<MediaDTO>
   */
  tagMedia(mediaId: number, tag: string): Observable<MediaDTO> {
    const params = new HttpParams().set('tag', tag);
    return this.http.post<MediaDTO>(`${this.mediaUrl}/${mediaId}/tag`, null, { params });
  }

  /**
   * Récupère tous les médias d'un compte
   *
   * @param accountId ID du compte
   * @returns Observable<MediaDTO[]>
   */
  getAllMedia(accountId: number): Observable<MediaDTO[]> {
    const params = new HttpParams().set('accountId', accountId.toString());
    return this.http.get<MediaDTO[]>(this.mediaUrl, { params });
  }

  /**
   * Met à jour un média (remplace le fichier)
   *
   * @param mediaId ID du média
   * @param file Nouveau fichier
   * @returns Observable<MediaDTO>
   */
  updateMedia(mediaId: number, file: File): Observable<MediaDTO> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<MediaDTO>(`${this.mediaUrl}/${mediaId}`, formData);
  }

  /**
   * Supprime un média
   *
   * @param mediaId ID du média
   * @returns Observable<void>
   */
  deleteMedia(mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.mediaUrl}/${mediaId}`);
  }

  /**
   * Récupère les médias publics filtrés par tag (PUBLIC - pour visiteurs)
   *
   * @param accountId ID du compte
   * @param tag Tag du média (lab, schema reseau, demo vlan)
   * @returns Observable<MediaDTO[]>
   */
  getMediaByTag(accountId: number, tag: string): Observable<MediaDTO[]> {
    const params = new HttpParams()
      .set('accountId', accountId.toString())
      .set('tag', tag);
    return this.http.get<MediaDTO[]>(`${this.mediaUrl}/public`, { params });
  }
}
