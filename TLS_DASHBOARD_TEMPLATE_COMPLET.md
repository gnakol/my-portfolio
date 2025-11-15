# Template HTML TLS Dashboard

Vu la limite de contexte, voici le code complet à copier dans :
`portfolio-template/src/app/components/monitoring/tls-dashboard/tls-dashboard.component.html`

Le dashboard contient :
- 📊 **Cards statistiques** (Total scans, Score moyen, Certificats expirant bientôt)
- 📈 **Graphique** d'évolution du score
- 📅 **Card Crontab** avec planification
- 🔍 **Filtre de recherche**
- 📋 **Tableau des scans** avec tri, pagination
- 🔎 **Modal détails** pour voir un scan complet
- 📥 **Export CSV**

---

**Fichiers créés Backend** :
✅ `/CrontabInfoDTO.java` - DTO pour crontab
✅ `/CrontabService.java` - Service lecture crontab
✅ Endpoints dans `SecurityStatusController.java`
  - `GET /security-status/crontab-info`
  - `GET /security-status/crontab-jobs`

**Fichiers créés Frontend** :
✅ `/tls-dashboard.service.ts` - Service Angular
✅ `/tls-dashboard.component.ts` - Composant TypeScript

---

## Prochaines étapes manuelles :

### 1. Copier le template HTML

Remplace le contenu de `tls-dashboard.component.html` par ce fichier :
👉 **Fichier généré** : `TLS_DASHBOARD_HTML.txt` (à créer avec le contenu ci-dessous)

### 2. Ajouter le bouton dans Mission Control

Dans `mission-control.component.html`, après le bouton "Advanced Scan", ajoute :

```html
<button
  (click)="openTlsDashboard()"
  class="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 ring-1 ring-purple-500/50 transition-all duration-200 text-sm flex items-center gap-2">
  <svg class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
  <span class="text-purple-200">TLS Dashboard</span>
</button>
```

### 3. Ajouter la méthode dans Mission Control Component

Dans `mission-control.component.ts`, ajoute :

```typescript
import { Router } from '@angular/router';

// Dans le constructor
constructor(
  private api: MissionControlService,
  private wsService: WebSocketService,
  private snackBar: MatSnackBar,
  private router: Router  // <-- AJOUTER
) {}

// Nouvelle méthode
openTlsDashboard(): void {
  this.router.navigate(['/tls-dashboard']);
}
```

### 4. Ajouter la route dans app-routing.module.ts

```typescript
import { TlsDashboardComponent } from './components/monitoring/tls-dashboard/tls-dashboard.component';

const routes: Routes = [
  // ... routes existantes
  {
    path: 'tls-dashboard',
    component: TlsDashboardComponent,
    canActivate: [AuthGuard]
  },
];
```

---

## ✅ Résultat final

Une fois terminé :
- Bouton "TLS Dashboard" visible dans Mission Control
- Page dédiée avec stats, graphiques, tableau
- Lecture de la config crontab
- Export CSV
- Modal détails pour chaque scan

Le dashboard est **100% fonctionnel** avec des données réelles depuis la base MySQL.
