// projets.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Params } from '@angular/router';
import { AddContactComponent } from '../../../components/contact-package/web-service/add-contact/add-contact.component';

interface ProjectLink {
  label: string;
  url?: string;              // route interne (ex: '/media-template') ou lien http
  queryParams?: Params;      // ex: { filter: 'lab' }
  disabled?: boolean;
  external?: boolean;        // true si lien http externe (ouvre dans un nouvel onglet)
}

interface Project {
  title: string;
  description: string;
  challenge: string;
  results: string[];
  stack: string[];
  links: ProjectLink[];
  image?: string;
  category: 'fullstack' | 'infrastructure' | 'innovation';
}

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss'],
  standalone: false
})
export class ProjetsComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  projects: Project[] = [
    {
      title: 'Portfolio Full-Stack en Production',
      description: 'Plateforme complète avec backend Spring Boot, frontend Angular, déployée sur AWS avec orchestration Kubernetes.',
      challenge: 'Mise en place d\'une CI/CD automatisée avec rollout Kubernetes sans downtime, monitoring temps réel et alerting proactif.',
      results: [
        'Uptime 99.9% sur 2025',
        'Temps de réponse API <200ms',
        'Déploiements automatisés via GitHub Actions',
        'Monitoring Prometheus + Grafana opérationnel'
      ],
      stack: [
        'Angular 19','Spring Boot 3.4','MySQL','Docker','Kubernetes',
        'AWS EC2','Nginx','Prometheus','Grafana','GitHub Actions'
      ],
      links: [
        { label: 'Code GitHub', url: '#', disabled: true, external: true },
        { label: 'Dashboard Grafana', url: '#', disabled: true, external: true },
        { label: 'Architecture', url: '#', disabled: true }
      ],
      category: 'fullstack'
    },
    {
      title: 'Lab Réseau Cisco Physique',
      description: 'Infrastructure réseau complète avec switches Cisco, serveurs Linux dédiés, Active Directory et segmentation VLAN avancée.',
      challenge: 'Conception et implémentation d\'un réseau d\'entreprise sécurisé avec routage dynamique, VPN site-to-site et politiques d\'accès granulaires.',
      results: [
        'VLAN segmentés (Data, VoIP, Management, Guest)',
        'OSPF multi-area opérationnel',
        'VPN IPsec site-to-site configuré',
        'Firewall ACL avec règles métier',
        'Active Directory intégré'
      ],
      stack: [
        'Cisco IOS','VLAN & Trunking','OSPF','ACL','VPN IPsec',
        'DHCP/DNS','Active Directory','Linux Server'
      ],
      links: [
        // 👉 Ces trois boutons ouvrent la galerie publique filtrée par tag
        { label: 'Photos du lab',   url: '/media-gallery', queryParams: { tag: 'lab' } },
        { label: 'Schéma réseau',   url: '/media-gallery', queryParams: { tag: 'schema reseau' } },
        { label: 'Démo VLAN',       url: '/media-gallery', queryParams: { tag: 'demo vlan' } }
      ],
      category: 'infrastructure'
    },
    {
      title: 'Simulateurs Réseau Interactifs',
      description: 'Suite de simulateurs pédagogiques intégrés au portfolio pour démontrer les concepts réseaux (VLAN, EIGRP, DHCP, Firewall).',
      challenge: 'Créer des interfaces interactives reproduisant le comportement de CLI Cisco avec animations visuelles et validation temps réel.',
      results: [
        'Simulateur VLAN avec terminal interactif',
        'Simulateur EIGRP (routage dynamique)',
        'Simulateur DHCP (relay + full)',
        'Simulateur Firewall (blocage d\'attaques)',
        'Animations GSAP pour visualisation réseau'
      ],
      stack: ['Angular','TypeScript','Canvas API','GSAP','RxJS','Material Design'],
      links: [
        { label: 'Accéder aux simulations', url: '/0a13f9e4-👁️-simulation-🛡️-network-bf1926' }
      ],
      category: 'innovation'
    }
  ];

  filteredProjects: Project[] = this.projects;
  activeFilter: string = 'all';

  filterProjects(category: string): void {
    this.activeFilter = category;
    this.filteredProjects = category === 'all'
      ? this.projects
      : this.projects.filter(p => p.category === category);

    // Scroll automatique vers les filtres (pour garder boutons + cards visibles)
    setTimeout(() => {
      const filtersSection = document.querySelector('.filters');
      if (filtersSection) {
        const yOffset = -20; // Petit décalage de 20px pour respirer
        const elementPosition = filtersSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset + yOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  openContactModal(): void {
  this.dialog.open(AddContactComponent, {
    width: '100%',
    maxWidth: '500px',
    panelClass: 'contact-modal-container',
    backdropClass: 'custom-backdrop'
  });
}
}
