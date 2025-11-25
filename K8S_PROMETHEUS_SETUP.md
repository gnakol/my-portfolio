# Configuration Prometheus pour Mission Control

## 🎯 Objectif

Le Mission Control MCO affiche maintenant des métriques Kubernetes récupérées depuis Prometheus :
- **Nombre de pods actifs** dans le namespace `portfolio`
- **RAM totale consommée** par les pods

Ces données permettent de **valider la cohérence** entre les dashboards Grafana (technique) et Mission Control (business).

---

## 📋 Prérequis

1. **Prometheus installé** sur le cluster K8s
2. **Kube-state-metrics** installé (pour exposer les métriques K8s)
3. **Port-forward SSH** ou accès interne au service Prometheus

---

## ⚙️ Configuration

### 1. **Local (développement)**

Dans `application.yml` :

```yaml
prometheus:
  url: http://localhost:9090
```

Port-forward vers Prometheus (si nécessaire) :
```bash
kubectl port-forward -n monitoring svc/prometheus-server 9090:80
```

---

### 2. **Production (AWS K8s)**

#### Option A : Port-forward SSH (actuel)

Comme tu le fais déjà pour Grafana, tu peux faire pareil pour Prometheus :

```bash
ssh -i ~/.ssh/portfolio-ci -L 9090:127.0.0.1:<PROMETHEUS_PORT> ubuntu@16.16.18.110
```

Puis dans `application-prod.yml` (ou variable d'environnement) :

```yaml
prometheus:
  url: http://localhost:9090
```

#### Option B : Service interne Kubernetes (recommandé)

Si Prometheus est déployé dans K8s, le pod `portfolio-api` peut l'interroger directement via le service K8s :

```yaml
prometheus:
  url: http://prometheus-server.monitoring.svc.cluster.local:80
```

Remplace `prometheus-server` et `monitoring` par le nom réel du service et du namespace Prometheus.

Pour vérifier :
```bash
kubectl get svc -n monitoring
```

#### Option C : Variable d'environnement

Dans ton déploiement K8s (`portfolio-api-deployment.yaml`), ajoute :

```yaml
env:
  - name: PROMETHEUS_URL
    value: "http://prometheus-server.monitoring.svc.cluster.local:80"
```

---

## 🔍 Queries PromQL utilisées

### Nombre de pods actifs
```promql
count(kube_pod_info{namespace="portfolio",pod=~"portfolio.*|mysql.*|nginx.*"})
```

### RAM totale des pods (en bytes)
```promql
sum(container_memory_working_set_bytes{namespace="portfolio",container!="",container!="POD"})
```

---

## 🧪 Tester les queries manuellement

1. Ouvre Grafana ou Prometheus UI
2. Va dans **Explore**
3. Copie-colle les queries ci-dessus
4. Vérifie que tu obtiens des valeurs cohérentes

Exemple de résultat attendu :
- **Pods count** : `4` (mysql, nginx, portfolio-api, portfolio-front)
- **RAM total** : ~1.2 GB (selon ta config)

---

## 📊 Validation pour LinkedIn

Une fois configuré, tu pourras faire la démo :

1. **Ouvre Mission Control** : `https://kolie-portfolio.org/mission-control`
2. **Note les valeurs** :
   - Pods actifs : `4`
   - RAM totale : `1.2 GB`
3. **Clique sur "Grafana"**
4. **Montre les mêmes métriques** dans Grafana avec les queries PromQL
5. **Message clé** : "Même source de données (Prometheus), deux interfaces : technique (Grafana) vs business (MCO)"

---

## 🚀 Déploiement

1. Build le backend :
   ```bash
   cd portfolio-api
   mvn clean package -DskipTests
   ```

2. Build le frontend :
   ```bash
   cd portfolio-template
   npm run build
   ```

3. Deploy sur AWS (via ton pipeline CI/CD)

4. Vérifie les logs du pod `portfolio-api` :
   ```bash
   kubectl logs -f deployment/portfolio-api -n portfolio
   ```

   Cherche les logs :
   ```
   ✅ Prometheus query successful: podsCount=4
   ✅ Prometheus query successful: totalRamBytes=1234567890
   ```

   Ou les erreurs :
   ```
   ❌ Error querying Prometheus: Connection refused
   ```

---

## 🐛 Troubleshooting

### Erreur : "Connection refused"

**Cause** : Le backend ne peut pas joindre Prometheus à l'URL configurée.

**Solutions** :
1. Vérifie que Prometheus est accessible :
   ```bash
   curl http://localhost:9090/api/v1/query?query=up
   ```

2. Vérifie la variable `prometheus.url` dans les logs :
   ```bash
   kubectl logs deployment/portfolio-api -n portfolio | grep prometheus
   ```

3. Teste depuis le pod :
   ```bash
   kubectl exec -it deployment/portfolio-api -n portfolio -- curl http://prometheus-server.monitoring.svc.cluster.local/api/v1/query?query=up
   ```

### Métriques à zéro (0 pods, 0 GB)

**Cause** : Les queries PromQL ne retournent aucun résultat.

**Solutions** :
1. Vérifie que `kube-state-metrics` est installé :
   ```bash
   kubectl get pods -n kube-system | grep kube-state-metrics
   ```

2. Teste les queries directement dans Prometheus UI

3. Ajuste les regex dans les queries (namespace, noms de pods)

---

## 📝 Notes

- Le service Prometheus interroge l'API toutes les fois que le MCO est ouvert (pas de cache pour l'instant)
- Timeout : 5 secondes par requête
- En cas d'erreur, les valeurs affichent `-` ou `0`
- Les logs d'erreur sont visibles dans les logs du backend (niveau `ERROR`)

---

## ✅ Checklist de validation

- [ ] Prometheus accessible depuis le backend
- [ ] Query pods count retourne `4`
- [ ] Query RAM retourne ~1.2 GB
- [ ] Mission Control affiche les valeurs correctes
- [ ] Grafana confirme les mêmes valeurs
- [ ] Prêt pour la démo LinkedIn 🎬
