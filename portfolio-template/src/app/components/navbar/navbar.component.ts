import { Component } from '@angular/core';
import { AuthenticationService } from '../../pages/authenticate/core/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../contact-package/web-service/add-contact/add-contact.component';

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
    //{ path: '/dashboard', label: 'Dashboard', active: false },
    { path: '/0a13f9e4-👁️-simulation-🛡️-network-bf1926', label: 'Simulations', active: false },
    //{ path: '/blog', label: 'Blog', active: false },
    { path: '/contact', label: 'Contact', active: false }
  ];

  constructor(
    public authService: AuthenticationService,
    private router : Router,
    private dialog : MatDialog,


  ) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe(status => {
      this.isAuthenticated = status;
    });
  }

onNavLinkClick(link: any): void {
  if (link.label === 'Contact') {
    this.dialog.open(AddContactComponent, {
      width: '100%',
      maxWidth: '500px',
      panelClass: 'contact-modal-container',
      backdropClass: 'custom-backdrop'
    });
    this.mobileMenuOpen = false;
    return;
  }

  if (link.path === '/' || link.path === '') {
    if (this.router.url === '/' || this.router.url === '') {
      // Déjà sur la home : remonte immédiatement
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    this.mobileMenuOpen = false;
    return;
  }

  this.router.navigate([link.path]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  this.mobileMenuOpen = false;
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
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}