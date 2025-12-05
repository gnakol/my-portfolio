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
import { ReminderService } from './reminder.service';
import {
  CreateReminderDto,
  UpdateReminderDto,
  ReminderResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: ReminderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.reminderService.findAll(page, limit);
  }

  @Get('candidacy/:candidacyId')
  async findByCandidacyId(
    @Param('candidacyId', ParseIntPipe) candidacyId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: ReminderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.reminderService.findByCandidacyId(candidacyId, page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReminderResponseDto> {
    return this.reminderService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createReminderDto: CreateReminderDto,
  ): Promise<ReminderResponseDto> {
    return this.reminderService.create(createReminderDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateReminderDto: UpdateReminderDto,
  ): Promise<ReminderResponseDto> {
    return this.reminderService.update(id, updateReminderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.reminderService.remove(id);
  }
}
