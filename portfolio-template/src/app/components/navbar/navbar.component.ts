import { Component } from '@angular/core';
import { AuthenticationService } from '../../pages/authenticate/core/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isAuthenticated: boolean = false;
  mobileMenuOpen: boolean = false; // Ajout de la propriété manquante


  navLinks = [
    { path: '/', label: 'Accueil', active: true },
    { path: '/cv', label: 'CV', active: false },
    { path: '/dashboard', label: 'Dashboard', active: false },
    { path: '/dashboard-simulation', label: 'Simulations', active: false },
    { path: '/blog', label: 'Blog', active: false },
    { path: '/contact', label: 'Contact', active: false }
  ];

  constructor(
    public authService: AuthenticationService,
    private router : Router

  ) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  updateActiveLinks(): void {
    const currentPath = this.router.url;
    this.navLinks = this.navLinks.map(link => ({
      ...link,
      active: currentPath === link.path
    }));
  }

  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen; // Implémentation de la méthode
  }
}