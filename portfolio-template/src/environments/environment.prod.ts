// src/environments/environment.prod.ts
export const environment = {
  production: true,

  // ton proxy Nginx redirige /api → backend
  apiBaseUrl: '/api',

  // ⚠️ ajouté pour le build Angular (mêmes clés que l'env de dev)
  grafana: {
    baseUrl: 'http://localhost:3000',  // domaine/host Grafana
    orgId: '1',

    paths: {
      application: '/d/adnl5wp/portfolio-master-monitoring',
      system:      '/d/adnl5wp/portfolio-master-monitoring',
      security:    '/d/adnl5wp/portfolio-master-monitoring'
    },

    defaultRange: 'now-6h',
    defaultTo: 'now',

    vars: {
      namespace: 'kube-system',
      pod: 'coredns-*'
    }
  }
};
