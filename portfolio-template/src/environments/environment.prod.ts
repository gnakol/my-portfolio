// src/environments/environment.prod.ts
export const environment = {
  production: true,

  // ton proxy Nginx redirige /api → backend
  apiBaseUrl: '/api',
  jobTrackApiUrl: 'http://localhost:3001/api', // Update this in production with correct URL

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
