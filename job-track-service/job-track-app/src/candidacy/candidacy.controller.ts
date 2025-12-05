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
import { CandidacyService } from './candidacy.service';
import {
  CreateCandidacyDto,
  UpdateCandidacyDto,
  CandidacyResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('candidacies')
@UseGuards(JwtAuthGuard)
export class CandidacyController {
  constructor(private readonly candidacyService: CandidacyService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: CandidacyResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.candidacyService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CandidacyResponseDto> {
    return this.candidacyService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createCandidacyDto: CreateCandidacyDto,
  ): Promise<CandidacyResponseDto> {
    return this.candidacyService.create(createCandidacyDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCandidacyDto: UpdateCandidacyDto,
  ): Promise<CandidacyResponseDto> {
    return this.candidacyService.update(id, updateCandidacyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.candidacyService.remove(id);
  }
}
