import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

// Models
import { Candidacy } from '../../models/candidacy.model';
import { EventType } from '../../models/application-event.model';
import { ReminderType, ReminderStatus } from '../../models/reminder.model';

@Component({
  selector: 'app-candidacy-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatCardModule
  ],
  templateUrl: './candidacy-details-modal.component.html',
  styleUrls: ['./candidacy-details-modal.component.scss']
})
export class CandidacyDetailsModalComponent {
  candidacy: Candidacy;

  constructor(
    public dialogRef: MatDialogRef<CandidacyDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidacy: Candidacy }
  ) {
    this.candidacy = data.candidacy;
  }

  // Close modal
  close(): void {
    this.dialogRef.close();
  }

  // Utility methods for status
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'SENT': 'Envoyée',
      'UNDER_REVIEW': 'En cours de révision',
      'PHONE_SCREENING': 'Entretien téléphonique',
      'INTERVIEW_SCHEDULED': 'Entretien programmé',
      'INTERVIEW_COMPLETED': 'Entretien effectué',
      'OFFER_RECEIVED': 'Offre reçue',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Rejetée',
      'WITHDRAWN': 'Retirée'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'SENT': '#6366f1',
      'UNDER_REVIEW': '#8b5cf6',
      'PHONE_SCREENING': '#3b82f6',
      'INTERVIEW_SCHEDULED': '#10b981',
      'INTERVIEW_COMPLETED': '#14b8a6',
      'OFFER_RECEIVED': '#22c55e',
      'ACCEPTED': '#16a34a',
      'REJECTED': '#ef4444',
      'WITHDRAWN': '#9ca3af'
    };
    return statusColors[status] || '#9ca3af';
  }

  // Utility methods for events
  getEventTypeLabel(type: EventType): string {
    const eventLabels: { [key: string]: string } = {
      'PHONE_CALL': 'Appel téléphonique',
      'EMAIL': 'Email',
      'INTERVIEW': 'Entretien',
      'OFFER': 'Offre',
      'REJECTION': 'Refus',
      'FOLLOW_UP': 'Relance',
      'TECHNICAL_TEST': 'Test technique',
      'OTHER': 'Autre'
    };
    return eventLabels[type] || type;
  }

  getEventIcon(type: EventType): string {
    const eventIcons: { [key: string]: string } = {
      'PHONE_CALL': 'phone',
      'EMAIL': 'email',
      'INTERVIEW': 'groups',
      'OFFER': 'card_giftcard',
      'REJECTION': 'cancel',
      'FOLLOW_UP': 'send',
      'TECHNICAL_TEST': 'code',
      'OTHER': 'more_horiz'
    };
    return eventIcons[type] || 'event';
  }

  getEventColor(type: EventType): string {
    const eventColors: { [key: string]: string } = {
      'PHONE_CALL': '#3b82f6',
      'EMAIL': '#6366f1',
      'INTERVIEW': '#10b981',
      'OFFER': '#22c55e',
      'REJECTION': '#ef4444',
      'FOLLOW_UP': '#f59e0b',
      'TECHNICAL_TEST': '#8b5cf6',
      'OTHER': '#9ca3af'
    };
    return eventColors[type] || '#9ca3af';
  }

  // Utility methods for reminders
  getReminderTypeLabel(type: ReminderType): string {
    const reminderLabels: { [key: string]: string } = {
      'FIRST_FOLLOW_UP': 'Première relance (J+3)',
      'SECOND_FOLLOW_UP': 'Deuxième relance (J+7)',
      'FINAL_FOLLOW_UP': 'Relance finale (J+14)',
      'INTERVIEW_PREPARATION': 'Préparation entretien',
      'CUSTOM': 'Personnalisé'
    };
    return reminderLabels[type] || type;
  }

  getReminderStatusLabel(status: ReminderStatus): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'COMPLETED': 'Complété',
      'DISMISSED': 'Ignoré',
      'OVERDUE': 'En retard'
    };
    return statusLabels[status] || status;
  }

  getReminderStatusColor(status: ReminderStatus): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'COMPLETED': '#22c55e',
      'DISMISSED': '#9ca3af',
      'OVERDUE': '#ef4444'
    };
    return statusColors[status] || '#9ca3af';
  }

  // Format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateShort(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Format salary
  formatSalary(min?: number, max?: number): string {
    if (!min && !max) return '-';
    if (min && max) return `${min}k - ${max}k €`;
    if (min) return `${min}k € minimum`;
    if (max) return `${max}k € maximum`;
    return '-';
  }

  // Get interest stars
  getInterestStars(level?: number): string {
    if (!level) return 'Non renseigné';
    return '⭐'.repeat(level) + ` (${level}/5)`;
  }

  // Check if has data
  hasEvents(): boolean {
    return !!(this.candidacy.events && this.candidacy.events.length > 0);
  }

  hasReminders(): boolean {
    return !!(this.candidacy.reminders && this.candidacy.reminders.length > 0);
  }

  hasStackTags(): boolean {
    return !!(this.candidacy.jobOffer?.stackTags && this.candidacy.jobOffer.stackTags.length > 0);
  }
}
