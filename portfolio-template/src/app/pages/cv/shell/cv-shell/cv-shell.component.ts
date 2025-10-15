import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CvSidebarComponent } from '../../components/cv-sidebar/cv-sidebar.component';

@Component({
  selector: 'app-cv-shell',
  standalone: true,
  imports: [CommonModule, CvSidebarComponent, RouterOutlet],
  templateUrl: './cv-shell.component.html',
  styleUrls: ['./cv-shell.component.scss']
})
export class CvShellComponent {}
