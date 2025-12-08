export enum ReminderStatus {
  PENDING = 'PENDING', // En attente
  SNOOZED = 'SNOOZED', // Reporté
  COMPLETED = 'COMPLETED', // Complété
  CANCELLED = 'CANCELLED', // Annulé
  EXPIRED = 'EXPIRED', // Expiré (jamais complété)
}
