import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MediaService, MediaDTO } from '../../../services/media.service';

type Kind = 'image' | 'video';

/** Élément de galerie : peut être local (staged) ou déjà persisté */
export type GalleryItem = MediaDTO & {
  /** true si pas encore persistant (seulement en mémoire) */
  localOnly?: boolean;
  /** Fichier source pour persistance ultérieure */
  file?: File;
  /** Type binaire (image | video) utile quand mediaType n'est pas encore un tag */
  kind?: Kind;
  /** id temporaire pour l’UI */
  tempId?: string;
  /** URL d’aperçu locale (blob:) à révoquer après upload */
  previewUrl?: string;
};

@Component({
  selector: 'app-media-template',
  standalone: true,
  templateUrl: './media-template.component.html',
  styleUrl: './media-template.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule]
})
export class MediaTemplateComponent implements OnInit {
  /** Liste affichée (mélange de locaux et persistés) */
  mediaList: GalleryItem[] = [];
  selectedMedia: GalleryItem | null = null;
  hoveredMediaId: string | number | null = null;
  accountId: number = 9; // TODO: Get from AuthService

  // Filtrage éventuel via ?filter=lab|schema reseau|demo vlan
  activeTagFilter: string | null = null;

  // Webcam
  showWebcam = false;
  cameraMode: 'photo' | 'video' = 'photo';
  isRecording = false;
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];

  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;
  @ViewChild('webcamVideo') webcamVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(q => {
      this.activeTagFilter = (q.get('filter') ?? '').trim() || null;
      this.loadMedia();
    });
  }

  /** Charge les médias persistés, puis conserve les items locaux déjà présents */
  loadMedia(): void {
    this.mediaService.getAllMedia(this.accountId).subscribe({
      next: (persisted) => {
        const locals = this.mediaList.filter(m => m.localOnly);
        // Recompose la liste : items persistés (backend) + items locaux non encore tagués
        this.mediaList = [
          ...persisted.map<GalleryItem>(m => ({ ...m, kind: this.toKindFromType(m.mediaType) })),
          ...locals
        ];
        // console.log('✅ Médias chargés (persistés):', persisted.length);
      },
      // error: (err) => console.error('❌ Erreur chargement médias:', err)
    });
  }

  /** Staging local : AUCUNE persistance ici */
  handleUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const kind: Kind = file.type.startsWith('video') ? 'video' : 'image';
      const previewUrl = URL.createObjectURL(file);
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const staged: GalleryItem = {
        // champs MediaDTO requis mais fictifs tant que localOnly
        mediaId: -1,
        accountId: this.accountId,
        mediaType: kind,         // provisoire: 'image' | 'video'
        url: previewUrl,         // on affiche la preview locale
        fileName: file.name,
        featured: false,
        createdAt: new Date().toISOString(),

        // extras
        localOnly: true,
        file,
        kind,
        tempId,
        previewUrl
      };

      this.mediaList = [staged, ...this.mediaList];
    });

    // reset input
    input.value = '';
  }

  /** Survol -> choix tag -> si local: upload puis tag. Si déjà persisté: juste tag. */
  applyTag(media: GalleryItem, tag: 'lab' | 'schema reseau' | 'demo vlan'): void {
    // console.log(`🏷️ Tag demandé: ${tag} sur`, media);

    // Cas 1 : item déjà en DB (pas localOnly) -> juste tagger
    if (!media.localOnly) {
      this.doTagPersisted(media, tag);
      return;
    }

    // Cas 2 : item local -> on persiste (upload) PUIS on tag
    const file = media.file!;
    const kind: Kind = media.kind || 'image';

    this.mediaService.uploadMedia(file, kind, this.accountId).subscribe({
      next: (created) => {
        // Ensuite Tag
        this.mediaService.tagMedia(created.mediaId, tag).subscribe({
          next: (updated) => {
            // Remplace l’item local par l’item persisté/tagué
            this.replaceLocalWithPersisted(media, {
              ...updated,
              kind: this.toKindFromType(updated.mediaType)
            });
            // console.log('✅ Persisté + tag appliqué');
          },
          error: (err) => {
            // console.error('❌ Erreur tag après upload:', err);
          }
        });
      },
      error: (err) => {
        // console.error('❌ Erreur upload (persist):', err);
      }
    });
  }

  /** Tag d’un média déjà persisté */
  private doTagPersisted(media: GalleryItem, tag: string) {
    this.mediaService.tagMedia(Number(media.mediaId), tag).subscribe({
      next: (updated) => {
        media.mediaType = updated.mediaType;
        media.kind = this.toKindFromType(updated.mediaType);
        // force refresh de l’URL signée potentiellement régénérée côté service (optionnel)
        media.url = updated.url || media.url;
        // console.log('✅ Tag appliqué sur média persisté');
      },
      // error: (err) => console.error('❌ Erreur tag persisté:', err)
    });
  }

  /** Remplacement de l’item local par l’item renvoyé par le backend */
  private replaceLocalWithPersisted(localItem: GalleryItem, persisted: GalleryItem) {
    // Libère l’URL blob locale
    if (localItem.previewUrl) URL.revokeObjectURL(localItem.previewUrl);

    // Remplace dans le tableau
    this.mediaList = this.mediaList.map(m =>
      m.tempId === localItem.tempId ? ({ ...persisted, localOnly: false }) : m
    );
  }

  /** Remplacer le fichier d'un média déjà persisté */
  updateMedia(media: GalleryItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !media.mediaId) return;

    this.mediaService.updateMedia(Number(media.mediaId), file).subscribe({
      next: (updated) => {
        // remonte l'url et le fileName
        this.mediaList = this.mediaList.map(m =>
          Number(m.mediaId) === Number(media.mediaId)
            ? ({ ...m, url: updated.url, fileName: updated.fileName })
            : m
        );
        // console.log('✅ Média remplacé:', updated.fileName);
      },
      // error: (err) => console.error('❌ Erreur update:', err)
    });

    input.value = '';
  }

  /** Supprimer : si local -> retire juste de la liste. Si persisté -> backend */
  deleteMedia(mediaIdOrTemp: number | string): void {
    const item = this.mediaList.find(m => (m.tempId ?? m.mediaId) === mediaIdOrTemp);
    if (!item) return;

    if (item.localOnly) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      this.mediaList = this.mediaList.filter(m => (m.tempId ?? m.mediaId) !== mediaIdOrTemp);
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      this.mediaService.deleteMedia(Number(item.mediaId)).subscribe({
        next: () => {
          // console.log('✅ Média supprimé');
          this.mediaList = this.mediaList.filter(m => m.mediaId !== item.mediaId);
        },
        // error: (err) => console.error('❌ Erreur delete:', err)
      });
    }
  }

  /** Lecture */
  playMedia(media: GalleryItem): void {
    this.selectedMedia = media;
  }

  /** Détermine l’ensemble affiché selon le filtre actif */
  get displayedMedia(): GalleryItem[] {
    if (!this.activeTagFilter) return this.mediaList;
    // n’affiche que les éléments tagués correspondant (les locaux non tagués restent visibles uniquement si pas de filtre)
    return this.mediaList.filter(m => !m.localOnly && (m.mediaType?.toLowerCase() === this.activeTagFilter!.toLowerCase()));
  }

  isImage(media: GalleryItem): boolean {
    return (media.kind === 'image')
      || (!!media.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(media.url));
  }
  isVideo(media: GalleryItem): boolean {
    return (media.kind === 'video')
      || (!!media.url && /\.(mp4|webm|ogg|mov)$/i.test(media.url));
  }

  private toKindFromType(mediaType?: string | null): Kind {
    const t = (mediaType ?? '').toLowerCase();
    if (t === 'video' || t === 'demo vlan') return 'video';
    return 'image'; // 'image', 'lab', 'schema reseau'
  }

  // Webcam (inchangé)
  toggleWebcam(mode: 'photo' | 'video' = 'photo'): void {
    this.cameraMode = mode;
    this.showWebcam = !this.showWebcam;
    if (this.showWebcam) this.startWebcam(); else this.stopMediaTracks();
  }
  private startWebcam(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: this.cameraMode === 'video' })
      .then(stream => {
        this.mediaStream = stream;
        if (this.webcamVideo) this.webcamVideo.nativeElement.srcObject = stream;
      })
      // .catch(err => console.error('❌ Erreur accès webcam:', err));
  }
  triggerSnapshot(): void {
    if (!this.webcamVideo || !this.mediaStream) return;
    const video = this.webcamVideo.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
      // au lieu d’upload direct, on STAGE aussi
      const previewUrl = URL.createObjectURL(file);
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const staged: GalleryItem = {
        mediaId: -1,
        accountId: this.accountId,
        mediaType: 'image',
        url: previewUrl,
        fileName: file.name,
        featured: false,
        createdAt: new Date().toISOString(),
        localOnly: true,
        file,
        kind: 'image',
        tempId,
        previewUrl
      };
      this.mediaList = [staged, ...this.mediaList];
      this.toggleWebcam();
    }, 'image/jpeg');
  }
  startRecording(): void {
    this.isRecording = true;
    this.recordedChunks = [];
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.mediaStream = stream;
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.recordedChunks.push(e.data); };
      this.mediaRecorder.start();
    });
  }
  stopRecording(): void {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const file = new File([blob], 'webcam-recording.webm', { type: 'video/webm' });
      // STAGE la vidéo
      const previewUrl = URL.createObjectURL(file);
      const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const staged: GalleryItem = {
        mediaId: -1,
        accountId: this.accountId,
        mediaType: 'video',
        url: previewUrl,
        fileName: file.name,
        featured: false,
        createdAt: new Date().toISOString(),
        localOnly: true,
        file,
        kind: 'video',
        tempId,
        previewUrl
      };
      this.mediaList = [staged, ...this.mediaList];
      this.toggleWebcam();
    };
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.stopMediaTracks();
  }
  private stopMediaTracks(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
  }
}
