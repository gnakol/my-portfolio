export class StatisticsByStackDto {
  stack: string;
  totalApplications: number;
  totalResponses: number;
  totalInterviews: number;
  totalOffersReceived: number;
  responseRate: number;
  interviewRate: number;
  successRate: number;
}

export class StackPerformanceDto {
  stacks: StatisticsByStackDto[];
  totalStacks: number;
}
