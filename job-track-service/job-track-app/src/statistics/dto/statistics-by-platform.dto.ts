export class StatisticsByPlatformDto {
  platform: string;
  totalApplications: number;
  totalResponses: number;
  totalInterviews: number;
  totalOffersReceived: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
}

export class PlatformPerformanceDto {
  platforms: StatisticsByPlatformDto[];
  totalPlatforms: number;
}
