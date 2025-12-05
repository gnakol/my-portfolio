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
import { StackTagService } from './stack-tag.service';
import {
  CreateStackTagDto,
  UpdateStackTagDto,
  StackTagResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stack-tags')
@UseGuards(JwtAuthGuard)
export class StackTagController {
  constructor(private readonly stackTagService: StackTagService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{
    data: StackTagResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stackTagService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StackTagResponseDto> {
    return this.stackTagService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createStackTagDto: CreateStackTagDto,
  ): Promise<StackTagResponseDto> {
    return this.stackTagService.create(createStackTagDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStackTagDto: UpdateStackTagDto,
  ): Promise<StackTagResponseDto> {
    return this.stackTagService.update(id, updateStackTagDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.stackTagService.remove(id);
  }
}
