import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactService } from '../../../../services/contact.service';
import { Contact, ContactResponse } from '../../contact.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PhoneFormatPipe } from '../../phone-format.pipe';
import { TruncatePipe } from '../../truncate.pipe';

@Component({
  selector: 'app-all-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    PhoneFormatPipe,
    TruncatePipe,
    MatTooltipModule
  ],
  templateUrl: './all-contact.component.html',
  styleUrls: ['./all-contact.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AllContactComponent implements OnInit {
  contacts: Contact[] = [];
  isLoading = false;
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.allContact(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.contacts = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        // console.error('Erreur lors du chargement des contacts', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  viewDetails(contact: Contact): void {
    // À implémenter avec le composant de détail
    // console.log('Détails du contact:', contact);
    // this.dialog.open(ContactDetailComponent, { data: contact });
  }

  deleteContact(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.'
      },
      panelClass: 'confirm-dialog-container'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            this.loadContacts();
          },
          error: (err) => {
            // console.error('Erreur lors de la suppression', err);
          }
        });
      }
    });
  }
}