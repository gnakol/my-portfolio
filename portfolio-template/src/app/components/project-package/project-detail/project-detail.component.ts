import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  projectType: string = '';
  iconType: string = 'folder';

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.project = this.data.project;
    this.projectType = this.project.projectType?.name || '';
    this.setCardStyle(this.projectType);
  }

  setCardStyle(typeName: string): void {
    const styles: {[key: string]: {color: string, gradient: string[], icon: string}} = {
      'Développement Fullstack': {
        color: '#4f46e5',
        gradient: ['#4f46e5', '#3730a3'],
        icon: 'code'
      },
      'Infrastructure & Réseaux': {
        color: '#10b981',
        gradient: ['#10b981', '#059669'],
        icon: 'settings_ethernet'
      },
      'Administration Système Linux': {
        color: '#3b82f6',
        gradient: ['#3b82f6', '#2563eb'],
        icon: 'terminal'
      },
      'Projet de reconversion & montée en compétences': {
        color: '#ec4899',
        gradient: ['#ec4899', '#db2777'],
        icon: 'school'
      },
      'Projet en cours & longue durée': {
        color: '#f59e0b',
        gradient: ['#f59e0b', '#d97706'],
        icon: 'hourglass_full'
      },
      'Portfolio personnel & démonstratif': {
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#7c3aed'],
        icon: 'collections'
      },
      'default': {
        color: '#6366f1',
        gradient: ['#6366f1', '#4f46e5'],
        icon: 'folder'
      }
    };

    const style = styles[typeName] || styles['default'];
    this.iconType = style.icon;

    // Appliquer les variables CSS dynamiques
    document.documentElement.style.setProperty('--card-color', style.color);
    document.documentElement.style.setProperty('--gradient-start', style.gradient[0]);
    document.documentElement.style.setProperty('--gradient-end', style.gradient[1]);
  }

  getDuration(): string {
    if (!this.project?.startDate) return '';
    
    const start = new Date(this.project.startDate);
    const end = this.project.endDate ? new Date(this.project.endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    
    if (months < 12) {
      return `${months} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ''}`;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
