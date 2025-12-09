import { Controller, Get, Query, UseGuards, Logger } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  StatisticsOverviewDto,
  StackPerformanceDto,
  LocationPerformanceDto,
  PlatformPerformanceDto,
} from './dto';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  async getOverview(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<StatisticsOverviewDto> {
    this.logger.log(`Getting statistics overview for user ${user.userId}`);

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.statisticsService.getOverview(user.userId, start, end);
  }

  @Get('by-stack')
  async getByStack(@CurrentUser() user: any): Promise<StackPerformanceDto> {
    this.logger.log(`Getting statistics by stack for user ${user.userId}`);
    return this.statisticsService.getByStack(user.userId);
  }

  @Get('by-location')
  async getByLocation(@CurrentUser() user: any): Promise<LocationPerformanceDto> {
    this.logger.log(`Getting statistics by location for user ${user.userId}`);
    return this.statisticsService.getByLocation(user.userId);
  }

  @Get('by-platform')
  async getByPlatform(@CurrentUser() user: any): Promise<PlatformPerformanceDto> {
    this.logger.log(`Getting statistics by platform for user ${user.userId}`);
    return this.statisticsService.getByPlatform(user.userId);
  }
}
