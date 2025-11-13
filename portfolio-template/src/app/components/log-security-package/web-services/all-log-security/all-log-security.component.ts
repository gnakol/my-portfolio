// all-log-security.component.ts
import { Component, OnInit } from '@angular/core';
import { LogSecurityDTO } from '../../log-security.model';
import { LogSecurityService } from '../../service/log-security.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-all-log-security',
  templateUrl: './all-log-security.component.html',
  styleUrls: ['./all-log-security.component.scss'],
  imports : [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class AllLogSecurityComponent implements OnInit {

  logs: LogSecurityDTO[] = [];

  selectedLogs: number[] = [];

  page = 0;

  size = 10;

  totalElements = 0;

   // Définir les colonnes à afficher dans le tableau
   displayedColumns: string[] = ['select', 'idLog', 'typeLog', 'message', 'dateLog', 'ipSource'];

  constructor(private logSecurityService: LogSecurityService) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.logSecurityService.getAllLogs(this.page, this.size).subscribe(response => {
      this.logs = response.content;
      this.totalElements = response.totalElements;
    });
  }

  onSelectLog(id: number): void {
    const index = this.selectedLogs.indexOf(id);
    if (index === -1) {
      this.selectedLogs.push(id);
    } else {
      this.selectedLogs.splice(index, 1);
    }
  }

// all-log-security.component.ts
onDeleteSelectedLogs(): void {
  this.logSecurityService.removeLogsByIds(this.selectedLogs).subscribe({
    next: (response) => {
      alert(response.message); // Afficher le message du serveur
      this.selectedLogs = []; // Réinitialiser la sélection
      this.loadLogs(); // Recharger les logs
    },
    error: (err) => {
      // console.error('Erreur lors de la suppression des logs :', err);
      alert('Une erreur est survenue lors de la suppression des logs.');
    }
  });
}

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadLogs();
  }

  // all-log-security.component.ts
selectAll(): void {
  if (this.selectedLogs.length === this.logs.length) {
    this.selectedLogs = []; // Désélectionner tout
  } else {
    this.selectedLogs = this.logs.map(log => log.idLog); // Sélectionner tout
  }
}
}