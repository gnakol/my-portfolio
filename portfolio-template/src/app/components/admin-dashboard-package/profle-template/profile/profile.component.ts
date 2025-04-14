// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../../../services/account.service';
import { AuthenticationService } from '../../../../pages/authenticate/core/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports : [
    CommonModule,
    MatIconModule,
    
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  // Données statiques pour la démo
  user: any = {
    username: '',
    email: '',
    avatar: ''
  };
  stats: any[] = [];

  private userId!: number;

  constructor(
    private accountService: AccountService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const parsedToken = this.authService.parseJwt(token!);

    if (parsedToken?.sub) {
      const email = parsedToken.sub;

      this.accountService.getAccountIdByEmail(email).subscribe(id => {
        this.userId = id;

        this.accountService.getAccountById(id).subscribe(account => {
          this.user.username = account.name + ' ' + account.firstName;
          this.user.email = account.email;
          this.user.avatar = account.profileImageUrl;

          this.stats = [
            { icon: 'verified', label: 'Compte', value: 'Premium', color: '#8b5cf6' },
            { icon: 'calendar_today', label: 'Inscription', value: '2023', color: '#3b82f6' },
            { icon: 'admin_panel_settings', label: 'Rôle', value: 'Administrateur', color: '#ec4899' },
            { icon: 'security', label: 'Connexion', value: 'Aujourd\'hui', color: '#10b981' }
          ];
        });
      });
    }
  }


  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    // Vérification cruciale
    if (file.size > 20 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 20MB)');
      return;
    }
  
    console.log('Token envoyé:', this.authService.getToken()); // Vérifie que le token est bon
  
    this.accountService.uploadProfileImage(this.userId, file).subscribe({
      next: (url) => {
        console.log('✅ Success!', url);
        this.user.avatar = url;
      },
      error: (err) => {
        console.error('🔥 Erreur complète:', err);
        if (err.status === 401) {
          alert('Session expirée, veuillez vous reconnecter');
          this.authService.logout();
        }
      }
    });
  }
  

  triggerFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event: any) => this.onAvatarChange(event);

    input.click();
  }
}