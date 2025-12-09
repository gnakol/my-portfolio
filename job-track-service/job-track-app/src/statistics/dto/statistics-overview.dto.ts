export class StatisticsOverviewDto {
  // Période
  startDate: Date;
  endDate: Date;

  // Compteurs généraux
  totalApplications: number;
  totalOffers: number;
  totalCompanies: number;

  // Taux de performance
  responseRate: number; // % d'offres qui ont eu une réponse
  interviewRate: number; // % de candidatures qui ont eu un entretien
  offerReceivedRate: number; // % de candidatures qui ont reçu une offre

  // Moyennes
  averageResponseTimeInDays: number; // Temps moyen de réponse des entreprises
  applicationsPerWeek: number; // Nombre moyen de candidatures par semaine

  // Statuts
  statusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
}
