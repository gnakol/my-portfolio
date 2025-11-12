export const environment = {
  production: false,
  apiBaseUrl: 'http://192.168.0.101:9000/portfolio-api',
  grafana: {
    baseUrl: 'http://localhost:3000',
    orgId: '1', // optionnel mais pratique

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
