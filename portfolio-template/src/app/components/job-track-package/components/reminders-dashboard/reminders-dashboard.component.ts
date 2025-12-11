import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

// Services & Models
import { ReminderService } from '../../services/reminder.service';
import {
  Reminder,
  ReminderDashboard,
  ReminderWithDaysInfo,
  ReminderPriority,
  ReminderStatus,
  ReminderType,
} from '../../models/reminder.model';

@Component({
  selector: 'app-reminders-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './reminders-dashboard.component.html',
  styleUrls: ['./reminders-dashboard.component.scss'],
})
export class RemindersDashboardComponent implements OnInit {
  // Loading states
  isLoading = false;

  // Dashboard data
  dashboardData: ReminderDashboard | null = null;
  criticalReminders: ReminderWithDaysInfo[] = [];

  // 🆕 Filtrage interactif
  selectedFilter: 'critical' | 'overdue' | 'today' | 'thisWeek' | 'upcoming' | null = 'overdue';
  displayedReminders: ReminderWithDaysInfo[] = [];

  // Enums for template
  ReminderPriority = ReminderPriority;
  ReminderStatus = ReminderStatus;
  ReminderType = ReminderType;

  constructor(
    private reminderService: ReminderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  loadDashboard(): void {
    this.isLoading = true;
    this.reminderService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        // Enhance critical reminders with days info
        this.criticalReminders = data.criticalReminders.map((reminder) =>
          this.reminderService.calculateDaysInfo(reminder)
        );

        // 🆕 Initialiser les rappels affichés selon le filtre sélectionné
        this.applyFilter(this.selectedFilter || 'critical');

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reminders dashboard:', error);
        this.showError('Erreur lors du chargement des rappels');
        this.isLoading = false;
      },
    });
  }

  // 🆕 Appliquer un filtre pour afficher les rappels correspondants
  applyFilter(filter: 'critical' | 'overdue' | 'today' | 'thisWeek' | 'upcoming'): void {
    this.selectedFilter = filter;

    if (!this.dashboardData) {
      this.displayedReminders = [];
      return;
    }

    let reminders: Reminder[] = [];

    switch (filter) {
      case 'critical':
        reminders = this.dashboardData.criticalReminders;
        break;
      case 'overdue':
        reminders = this.dashboardData.overdueReminders;
        break;
      case 'today':
        reminders = this.dashboardData.todayReminders;
        break;
      case 'thisWeek':
        reminders = this.dashboardData.thisWeekReminders;
        break;
      case 'upcoming':
        reminders = this.dashboardData.upcomingReminders;
        break;
    }

    // Enrichir avec les informations de jours
    this.displayedReminders = reminders.map((reminder) =>
      this.reminderService.calculateDaysInfo(reminder)
    );
  }

  refresh(): void {
    this.loadDashboard();
    this.showSuccess('Données actualisées');
  }

  // ============================================================================
  // REMINDER ACTIONS
  // ============================================================================

  snoozeReminder(id: number, days: number): void {
    this.reminderService.snoozeReminder(id, days).subscribe({
      next: () => {
        this.showSuccess(`Rappel reporté de ${days} jour(s)`);
        this.loadDashboard();
      },
      error: (error) => {
        console.error('Error snoozing reminder:', error);
        this.showError('Erreur lors du report du rappel');
      },
    });
  }

  completeReminder(id: number, comment?: string): void {
    this.reminderService.completeReminder(id, comment).subscribe({
      next: () => {
        this.showSuccess('Rappel marqué comme terminé');
        this.loadDashboard();
      },
      error: (error) => {
        console.error('Error completing reminder:', error);
        this.showError('Erreur lors de la complétion du rappel');
      },
    });
  }

  cancelReminder(id: number): void {
    this.reminderService.cancelReminder(id).subscribe({
      next: () => {
        this.showSuccess('Rappel annulé');
        this.loadDashboard();
      },
      error: (error) => {
        console.error('Error cancelling reminder:', error);
        this.showError('Erreur lors de l\'annulation du rappel');
      },
    });
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  goBack(): void {
    this.router.navigate(['/job-track-template']);
  }

  viewCandidacyDetails(candidacyId: number): void {
    this.router.navigate(['/job-track-candidacies'], {
      queryParams: { id: candidacyId },
    });
  }

  navigateToAllReminders(): void {
    // Navigate to full reminders list page (TODO: implement later)
    this.showInfo('Page de liste complète à venir');
  }

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  getReminderPriorityClass(reminder: ReminderWithDaysInfo): string {
    if (reminder.isOverdue && reminder.daysOverdue && reminder.daysOverdue >= 3) {
      return 'priority-critical';
    }
    if (reminder.isOverdue || reminder.isToday) {
      return 'priority-high';
    }
    if (reminder.isThisWeek) {
      return 'priority-medium';
    }
    return 'priority-low';
  }

  getReminderPriorityIcon(reminder: ReminderWithDaysInfo): string {
    if (reminder.isOverdue && reminder.daysOverdue && reminder.daysOverdue >= 3) {
      return 'error';
    }
    if (reminder.isOverdue) {
      return 'warning';
    }
    if (reminder.isToday) {
      return 'today';
    }
    return 'schedule';
  }

  getReminderUrgencyLabel(reminder: ReminderWithDaysInfo): string {
    if (reminder.isOverdue && reminder.daysOverdue) {
      return `En retard de ${reminder.daysOverdue} jour${reminder.daysOverdue > 1 ? 's' : ''}`;
    }
    if (reminder.isToday) {
      return 'Aujourd\'hui';
    }
    if (reminder.daysUntilDue !== undefined) {
      return `Dans ${reminder.daysUntilDue} jour${reminder.daysUntilDue > 1 ? 's' : ''}`;
    }
    return 'À venir';
  }

  getReminderTypeLabel(type: string): string {
    return this.reminderService.getReminderTypeLabel(type);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  getPriorityBadgeColor(count: number): string {
    if (count === 0) return 'default';
    if (count >= 5) return 'warn';
    return 'accent';
  }

  // ============================================================================
  // SNACKBAR MESSAGES
  // ============================================================================

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }
}
