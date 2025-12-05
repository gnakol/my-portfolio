import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import {
  CreateJobOfferDto,
  UpdateJobOfferDto,
  JobOfferResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('job-offers')
@UseGuards(JwtAuthGuard)
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: JobOfferResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.jobOfferService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<JobOfferResponseDto> {
    return this.jobOfferService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    return this.jobOfferService.create(createJobOfferDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    return this.jobOfferService.update(id, updateJobOfferDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.jobOfferService.remove(id);
  }
}
