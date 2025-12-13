# Système de Rappels Intelligent

## 📋 État actuel

### Backend (NestJS)
- ✅ Entity `Reminder` complète avec tous les champs
- ✅ CRUD complet (create, read, update, delete)
- ✅ Création automatique de 3 reminders par candidature:
  - J+3 → FIRST_FOLLOW_UP
  - J+7 → SECOND_FOLLOW_UP
  - J+14 → FINAL_FOLLOW_UP
- ✅ Endpoint `GET /reminders/candidacy/:id` pour récupérer les reminders d'une candidature
- ✅ Status: PENDING par défaut

### Base de données
```sql
Table "reminder"
- id_reminder (PK)
- id_candidacy (FK → candidacy)
- due_date (timestamptz)
- reminder_type (varchar 50)
- status (varchar 50)
- comment (text)
- auto_generated (boolean, default true)
- created_at (timestamptz)
- INDEX sur (due_date, status)
```

### Frontend
- ❌ **RIEN N'EXISTE ENCORE** - C'est ce je vais créer!

---

## 🎯 OBJECTIFS DU SYSTÈME INTELLIGENT

### 1. Dashboard de Rappels Intelligent
Un véritable centre de commandement pour suivre toutes les candidatures qui nécessitent une action.

### 2. Système d'Alertes Visuelles
Des indicateurs clairs qui attirent l'attention sur les candidatures urgentes.

### 3. Analyse Temporelle Intelligente
Comprendre automatiquement quelles candidatures sont:
- ✅ OK (dans les temps)
- ⚠️ Attention (bientôt à relancer)
- 🔥 Urgent (en retard)
- ⏰ Critique (très en retard)

### 4. Actions Rapides
Permettre de snooze, compléter, ou reprogrammer un reminder en 1 clic.

---

## 🏗️ ARCHITECTURE DE LA SOLUTION

### Phase 1: Backend - Endpoints Intelligents ⚡

#### 1.1. Ajouter des ENUMS pour les statuts et types

**Fichier**: `job-track-service/job-track-app/src/reminder/enums/reminder-status.enum.ts`
```typescript
export enum ReminderStatus {
  PENDING = 'PENDING',       // En attente
  SNOOZED = 'SNOOZED',      // Reporté
  COMPLETED = 'COMPLETED',   // Complété
  CANCELLED = 'CANCELLED',   // Annulé
  EXPIRED = 'EXPIRED'        // Expiré (jamais complété)
}

export enum ReminderType {
  FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',      // J+3
  SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',    // J+7
  FINAL_FOLLOW_UP = 'FINAL_FOLLOW_UP',      // J+14
  CUSTOM = 'CUSTOM',                         // Créé manuellement
  INTERVIEW = 'INTERVIEW',                   // Entretien programmé
  DEADLINE = 'DEADLINE'                      // Date limite
}

export enum ReminderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

#### 1.2. Améliorer l'Entity Reminder

**Ajouter des champs supplémentaires**:
```typescript
@Column({ name: 'priority', default: 'MEDIUM' })
priority: ReminderPriority;

@Column({ name: 'snoozed_until', type: 'timestamptz', nullable: true })
snoozedUntil?: Date;

@Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
completedAt?: Date;

@Column({ name: 'original_due_date', type: 'timestamptz', nullable: true })
originalDueDate?: Date;  // Pour historique si on change la date
```

#### 1.3. Nouvel endpoint: Dashboard des Rappels

**`GET /api/reminders/dashboard`**

Retourne:
```typescript
{
  "summary": {
    "total": 47,
    "overdue": 8,      // En retard
    "today": 3,        // Aujourd'hui
    "thisWeek": 12,    // Cette semaine
    "upcoming": 24     // À venir
  },
  "byPriority": {
    "CRITICAL": 2,
    "HIGH": 6,
    "MEDIUM": 25,
    "LOW": 14
  },
  "byCandidacyStatus": {
    "SENT": 15,
    "UNDER_REVIEW": 10,
    "PHONE_SCREENING": 8,
    "INTERVIEW_SCHEDULED": 5,
    // ...
  },
  "criticalReminders": [
    {
      "id": 22,
      "candidacyId": 8,
      "dueDate": "2025-12-10T00:00:00Z",
      "reminderType": "FIRST_FOLLOW_UP",
      "status": "PENDING",
      "priority": "CRITICAL",
      "daysOverdue": 2,
      "candidacy": {
        "id": 8,
        "currentStatus": "SENT",
        "applicationDate": "2025-12-07",
        "company": {
          "name": "Apside"
        },
        "jobOffer": {
          "title": "Développeur Full Stack Java/Angular"
        }
      }
    }
  ]
}
```

#### 1.4. Endpoint: Snooze un reminder

**`POST /api/reminders/:id/snooze`**

Body:
```json
{
  "snoozeDays": 3  // Reporter de 3 jours
}
```

#### 1.5. Endpoint: Compléter un reminder

**`POST /api/reminders/:id/complete`**

Body (optionnel):
```json
{
  "comment": "Relance effectuée par email"
}
```

#### 1.6. Endpoint: Analyse intelligente de priorité

**`GET /api/reminders/analyze`**

Utilise une logique intelligente pour calculer la priorité:
- `CRITICAL`: En retard de 3+ jours ET candidacy status = SENT/UNDER_REVIEW
- `HIGH`: En retard de 1-2 jours OU aujourd'hui + status important
- `MEDIUM`: Cette semaine
- `LOW`: Plus tard

#### 1.7. Service: Auto-update des priorités

Un cron job (ou task scheduler NestJS) qui tourne toutes les heures:
```typescript
@Cron('0 * * * *')  // Toutes les heures
async updateReminderPriorities() {
  // Recalcule les priorités en fonction de:
  // - Date actuelle vs due_date
  // - Status de la candidature
  // - Type de reminder
}
```

---

### Phase 2: Frontend - Dashboard Visuel 🎨

#### 2.1. Créer le modèle TypeScript

**`src/app/components/job-track-package/models/reminder.model.ts`**

```typescript
export interface Reminder {
  id: number;
  candidacyId: number;
  dueDate: string;
  reminderType: ReminderType;
  status: ReminderStatus;
  priority?: ReminderPriority;
  comment?: string;
  autoGenerated: boolean;
  snoozedUntil?: string;
  completedAt?: string;
  originalDueDate?: string;
  createdAt: string;

  // Relations
  candidacy?: {
    id: number;
    currentStatus: string;
    applicationDate: string;
    company: {
      name: string;
    };
    jobOffer: {
      title: string;
    };
  };
}

export enum ReminderStatus {
  PENDING = 'PENDING',
  SNOOZED = 'SNOOZED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum ReminderType {
  FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
  SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
  FINAL_FOLLOW_UP = 'FINAL_FOLLOW_UP',
  CUSTOM = 'CUSTOM',
  INTERVIEW = 'INTERVIEW',
  DEADLINE = 'DEADLINE'
}

export enum ReminderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ReminderDashboard {
  summary: {
    total: number;
    overdue: number;
    today: number;
    thisWeek: number;
    upcoming: number;
  };
  byPriority: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  byCandidacyStatus: { [key: string]: number };
  criticalReminders: Reminder[];
}
```

#### 2.2. Service Angular

**`src/app/components/job-track-package/services/reminder.service.ts`**

```typescript
@Injectable({ providedIn: 'root' })
export class ReminderService {
  private apiUrl = `${environment.jobTrackApiUrl}/reminders`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ReminderDashboard> {
    return this.http.get<ReminderDashboard>(`${this.apiUrl}/dashboard`);
  }

  getAll(page = 1, limit = 10): Observable<PaginatedResponse<Reminder>> {
    return this.http.get<PaginatedResponse<Reminder>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  getByCandidacy(candidacyId: number): Observable<PaginatedResponse<Reminder>> {
    return this.http.get<PaginatedResponse<Reminder>>(
      `${this.apiUrl}/candidacy/${candidacyId}`
    );
  }

  snooze(id: number, days: number): Observable<Reminder> {
    return this.http.post<Reminder>(`${this.apiUrl}/${id}/snooze`, { snoozeDays: days });
  }

  complete(id: number, comment?: string): Observable<Reminder> {
    return this.http.post<Reminder>(`${this.apiUrl}/${id}/complete`, { comment });
  }

  update(id: number, data: Partial<Reminder>): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### 2.3. Composant: Reminders Dashboard

**`src/app/components/job-track-package/components/reminders-dashboard/`**

Structure du composant:
```
reminders-dashboard/
├── reminders-dashboard.component.ts
├── reminders-dashboard.component.html
├── reminders-dashboard.component.scss
└── components/
    ├── reminder-card/               // Card pour un reminder
    ├── priority-badge/              // Badge de priorité
    ├── reminder-timeline/           // Timeline visuelle
    └── quick-actions-menu/          // Actions rapides (snooze, complete, etc.)
```

**Design du Dashboard**:

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 Mes Rappels                                   🔄 Refresh │
├─────────────────────────────────────────────────────────────┤
│  📊 Vue d'ensemble                                           │
│  ┌───────────┬───────────┬───────────┬───────────┐         │
│  │ 🔥 EN     │ 📅 AUJ.   │ 📆 SEMAINE│ ⏳ À VENIR│         │
│  │ RETARD: 8 │ HUI: 3    │ 12        │ 24        │         │
│  └───────────┴───────────┴───────────┴───────────┘         │
├─────────────────────────────────────────────────────────────┤
│  🚨 Rappels Critiques                                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🔴 CRITIQUE - En retard de 2 jours                    │ │
│  │ 🏢 Apside - Développeur Full Stack                    │ │
│  │ 📅 Relance J+3 (prévu le 10/12)                      │ │
│  │ 💼 Statut: Envoyée                                    │ │
│  │ [⏰ Reporter] [✅ Compléter] [👁️ Voir détails]       │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🟠 URGENT - Aujourd'hui                               │ │
│  │ 🏢 Kraken - Backend Engineer                          │ │
│  │ 📅 Relance J+7 (prévu aujourd'hui)                   │ │
│  │ 💼 Statut: En cours de révision                      │ │
│  │ [⏰ Reporter] [✅ Compléter] [👁️ Voir détails]       │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  📋 Tous les rappels                                         │
│  [Filtres: Statut | Priorité | Type | Date]                │
│  [Table avec pagination...]                                  │
└─────────────────────────────────────────────────────────────┘
```

**Codes couleur par priorité**:
- 🔴 CRITICAL: Rouge vif + animation clignotante + bordure épaisse
- 🟠 HIGH: Orange + bordure accentuée
- 🟡 MEDIUM: Jaune/Bleu clair
- 🟢 LOW: Vert/Gris

#### 2.4. Intégration dans le Dashboard principal

Ajouter une **section "Rappels"** dans le dashboard job-track existant:

```html
<!-- Dans dashboard.component.html -->
<div class="reminders-widget">
  <h3>🔔 Rappels urgents</h3>
  <div *ngIf="criticalReminders.length > 0" class="critical-reminders">
    <app-reminder-card
      *ngFor="let reminder of criticalReminders.slice(0, 3)"
      [reminder]="reminder"
      [compact]="true"
      (snooze)="onSnooze($event)"
      (complete)="onComplete($event)">
    </app-reminder-card>
  </div>
  <button mat-stroked-button (click)="navigateToReminders()">
    Voir tous les rappels ({{ totalReminders }})
  </button>
</div>
```

#### 2.5. Badge de notification

Ajouter un **badge** dans la navigation pour indiquer le nombre de reminders urgents:

```html
<!-- Dans job-track-template.component.html -->
<button mat-button routerLink="/job-track/reminders">
  <mat-icon [matBadge]="urgentRemindersCount"
            matBadgeColor="warn"
            [matBadgeHidden]="urgentRemindersCount === 0">
    notifications
  </mat-icon>
  Rappels
</button>
```

---

### Phase 3: Fonctionnalités Avancées 🚀

#### 3.1. Timeline visuelle des reminders

Pour chaque candidature, afficher une timeline:

```
Application      J+3           J+7              J+14
    |------------|-------------|----------------|
    ✅          ⏰ En attente   🕐 Programmé    🕐 Programmé
 2025-12-07   2025-12-10    2025-12-14      2025-12-21
```

#### 3.2. Smart Suggestions

Le système analyse et suggère:
- "Cette entreprise répond en général sous 5 jours, patience!"
- "Aucune réponse depuis 14 jours, relance recommandée"
- "Statut non mis à jour depuis 10 jours"

#### 3.3. Bulk Actions

Permettre de:
- Reporter tous les reminders en retard de 3 jours
- Compléter plusieurs reminders d'un coup
- Filtrer et agir en masse

#### 3.4. Notifications par email (optionnel - Phase future)

Intégration avec un service d'emailing:
- Email quotidien avec résumé des rappels du jour
- Alerte si reminder critique

#### 3.5. Statistiques des relances

Ajouter dans les stats:
- Taux de relance effectué
- Temps moyen avant première réponse
- Efficacité des relances (combien mènent à un entretien)

---

## 📅 PLANNING D'IMPLÉMENTATION

### Sprint 1: Backend Foundation (2-3h)
1. ✅ Créer les enums
2. ✅ Enrichir l'entity Reminder
3. ✅ Créer endpoint `/reminders/dashboard`
4. ✅ Créer endpoints snooze et complete
5. ✅ Ajouter logique de calcul de priorité

### Sprint 2: Frontend Core (3-4h)
1. ✅ Créer modèles TypeScript
2. ✅ Créer ReminderService
3. ✅ Créer composant RemindersDashboard
4. ✅ Créer composant ReminderCard
5. ✅ Styling complet avec animations

### Sprint 3: Intégration (1-2h)
1. ✅ Ajouter widget dans dashboard principal
2. ✅ Ajouter badge notifications
3. ✅ Routing et navigation
4. ✅ Tests manuels complets

### Sprint 4: Features Avancées (2-3h)
1. ✅ Timeline visuelle
2. ✅ Bulk actions
3. ✅ Filtres avancés
4. ✅ Smart suggestions (analytics basiques)

---

## 🎨 DESIGN SYSTEM

### Couleurs par priorité
```scss
$critical: #ef4444;  // Rouge vif
$high: #f97316;      // Orange
$medium: #3b82f6;    // Bleu
$low: #64748b;       // Gris

$overdue: #dc2626;   // Rouge foncé (en retard)
$today: #f59e0b;     // Ambre (aujourd'hui)
$upcoming: #10b981;  // Vert (à venir)
```

### Animations
- Clignotement subtil pour CRITICAL
- Pulse pour les reminders du jour
- Slide-in pour les nouveaux reminders

---

## 🔥 INNOVATIONS

1. **Auto-prioritization intelligente**: Pas besoin de marquer manuellement, le système sait ce qui est urgent

2. **One-click actions**: Snooze ou complete en 1 clic, pas de modal compliqué

3. **Contextual awareness**: Le système comprend le contexte (status candidature, temps écoulé, historique)

4. **Visual impact**: Dashboard ultra-visuel avec codes couleur et animations

5. **Proactive alerts**: Le système te prévient AVANT que ce soit trop tard

6. **Historical tracking**: Tu peux voir quand tu as relancé, combien de fois, etc.

7. **Performance metrics**: Stats sur ton taux de relance et efficacité

---

## 🎯 RÉSULTAT FINAL

Un système de rappels qui:
- ✅ Te dit exactement quoi faire et quand
- ✅ S'adapte automatiquement à l'urgence
- ✅ Rend visible l'invisible (candidatures oubliées)
- ✅ Te fait gagner un temps fou
- ✅ Impressionne les recruteurs qui verront ton portfolio
- ✅ Est 100x plus puissant qu'Excel

**LE GOAL**: Tu ouvres l'app → tu vois immédiatement ce qui nécessite ton attention → tu agis en 1 clic → tu continues ta recherche d'emploi efficacement.

1. Backend d'abord (endpoints + logique)
2. Frontend ensuite (dashboard + composants)
3. Intégration finale
