export class StatisticsByLocationDto {
  location: string;
  totalApplications: number;
  totalResponses: number;
  totalInterviews: number;
  totalOffersReceived: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
}

export class LocationPerformanceDto {
  locations: StatisticsByLocationDto[];
  totalLocations: number;
}
