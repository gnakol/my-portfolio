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
import { ApplicationEventService } from './application-event.service';
import {
  CreateApplicationEventDto,
  UpdateApplicationEventDto,
  ApplicationEventResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('application-events')
@UseGuards(JwtAuthGuard)
export class ApplicationEventController {
  constructor(
    private readonly applicationEventService: ApplicationEventService,
  ) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: ApplicationEventResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.applicationEventService.findAll(page, limit);
  }

  @Get('candidacy/:candidacyId')
  async findByCandidacy(
    @Param('candidacyId', ParseIntPipe) candidacyId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: ApplicationEventResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.applicationEventService.findByCandidacy(
      candidacyId,
      page,
      limit,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApplicationEventResponseDto> {
    return this.applicationEventService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createApplicationEventDto: CreateApplicationEventDto,
  ): Promise<ApplicationEventResponseDto> {
    return this.applicationEventService.create(createApplicationEventDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateApplicationEventDto: UpdateApplicationEventDto,
  ): Promise<ApplicationEventResponseDto> {
    return this.applicationEventService.update(id, updateApplicationEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.applicationEventService.remove(id);
  }
}
