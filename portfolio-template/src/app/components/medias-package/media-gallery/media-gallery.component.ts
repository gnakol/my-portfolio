import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaService, MediaDTO } from '../../../services/media.service';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterModule]
})
export class MediaGalleryComponent implements OnInit {
  mediaList: MediaDTO[] = [];
  selectedMedia: MediaDTO | null = null;
  tag: string = '';
  accountId: number = 9; // TODO: Get from config/environment
  isLoading: boolean = true;

  // Mapping tag -> titre affiché
  tagLabels: Record<string, string> = {
    'lab': 'Photos du Lab Cisco',
    'schema reseau': 'Schémas Réseau',
    'demo vlan': 'Démonstrations VLAN'
  };

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    // Récupère le tag depuis l'URL (ex: /media-gallery?tag=lab)
    this.route.queryParamMap.subscribe(params => {
      this.tag = params.get('tag') || '';
      if (this.tag) {
        this.loadMediaByTag();
      }
    });
  }

  /**
   * Charge les médias filtrés par tag depuis le backend
   */
  loadMediaByTag(): void {
    this.isLoading = true;
    this.mediaService.getMediaByTag(this.accountId, this.tag).subscribe({
      next: (media) => {
        this.mediaList = media;
        this.isLoading = false;
        console.log(`✅ ${media.length} médias chargés pour tag="${this.tag}"`);
      },
      error: (err) => {
        console.error('❌ Erreur chargement médias publics:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Ouvre un média en plein écran
   */
  openMedia(media: MediaDTO): void {
    this.selectedMedia = media;
  }

  /**
   * Ferme le média en plein écran
   */
  closeMedia(): void {
    this.selectedMedia = null;
  }

  /**
   * Vérifie si c'est une image
   */
  isImage(media: MediaDTO): boolean {
    return media.mediaType === 'lab' || media.mediaType === 'schema reseau'
      || media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  }

  /**
   * Vérifie si c'est une vidéo
   */
  isVideo(media: MediaDTO): boolean {
    return media.mediaType === 'demo vlan'
      || media.url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  }

  /**
   * Retourne le titre de la galerie selon le tag
   */
  get galleryTitle(): string {
    return this.tagLabels[this.tag] || 'Galerie Médias';
  }
}
