export interface StatisticsOverview {
  startDate?: Date;
  endDate?: Date;
  totalApplications: number;
  totalOffers: number;
  totalCompanies: number;
  responseRate: number;
  interviewRate: number;
  offerReceivedRate: number;
  averageResponseTimeInDays: number;
  applicationsPerWeek: number;
  statusBreakdown: StatusBreakdown[];
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface StackStatistics {
  stacks: StackPerformance[];
  totalStacks: number;
}

export interface StackPerformance {
  stackName: string;
  totalApplications: number;
  totalResponses: number;
  totalInterviews: number;
  totalOffersReceived: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
}

export interface LocationStatistics {
  locations: LocationPerformance[];
  totalLocations: number;
}

export interface LocationPerformance {
  location: string;
  totalApplications: number;
  totalResponses: number;
  totalInterviews: number;
  totalOffersReceived: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
}
