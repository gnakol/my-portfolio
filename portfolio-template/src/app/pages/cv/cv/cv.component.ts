import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent implements OnInit {

  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;
  private speedFactor = 1.8;
  
  // Lignes du terminal qui défilent
  terminalLines: any[] = [];
private terminalCommands = [
  { command: 'whoami', delay: 700 },
  { command: "Kolie N'GNA — Développeur Java / Spring • Angular", delay: 700 },

  { command: '', delay: 300 },
  { command: 'cat skills.txt', delay: 1000 },
  { command: 'Backend  : Java • Spring Boot • REST • JPA/Hibernate', delay: 220 },
  { command: 'Frontend : Angular • TypeScript • RxJS', delay: 220 },
  { command: 'Cloud    : AWS (EC2, S3, IAM) • Docker • Kubernetes', delay: 220 },
  { command: 'CI/CD    : GitLab CI • Jenkins • SonarQube', delay: 220 },
  { command: 'Security : Pentest basics • OWASP • Keycloak/OAuth2', delay: 220 },
  { command: 'Network  : Cisco Lab (VLAN, EIGRP, DHCP)', delay: 220 },

  { command: '', delay: 400 },
  { command: 'cat projects.md', delay: 1000 },
  { command: '- Microservices Spring + Angular déployés sur AWS', delay: 220 },
  { command: '- Pipeline CI/CD GitLab → Kubernetes', delay: 220 },
  { command: '- Monitoring & logs (Prometheus / Grafana)', delay: 220 },

  { command: '', delay: 400 },
  { command: 'echo "Disponible pour nouvelles opportunités (CDI / Alternance)"', delay: 900 },
  { command: 'Disponible pour nouvelles opportunités (CDI / Alternance)', delay: 1800 },

  { command: '', delay: 600 },
  { command: 'connect --with-recruiter', delay: 1600 }
];


  private currentCommandIndex = 0;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startTerminalAnimation();
  }

  showSection(section: string): void {
    this.router.navigate(['/cv', section]);
  }

  generatePdf(): void {
    this.router.navigate(['/pdf-generator']);
  }

  private startTerminalAnimation(): void {
    this.typeNextCommand();
  }

  private typeNextCommand(): void {
    if (this.currentCommandIndex < this.terminalCommands.length) {
      const currentCommand = this.terminalCommands[this.currentCommandIndex];
      
setTimeout(() => {
  this.terminalLines.push({
    command: currentCommand.command,
    timestamp: new Date()
  });

  // force Angular à peindre la nouvelle ligne puis scroll en bas
  this.cdr.detectChanges();
  this.scrollToBottom();

  this.currentCommandIndex++;
  this.typeNextCommand();
}, Math.round(currentCommand.delay * this.speedFactor));
    } else {
      // Recommence l'animation après un délai
      setTimeout(() => {
        this.terminalLines = [];
        this.currentCommandIndex = 0;
        this.typeNextCommand();
      }, 5000);
    }
  }

  private scrollToBottom(): void {
  // sécurité si la ViewChild n’est pas encore dispo
  if (!this.scrollArea) return;
  const el = this.scrollArea.nativeElement;
  // place le scroll tout en bas pour rendre visible la dernière ligne
  el.scrollTop = el.scrollHeight;
}

}