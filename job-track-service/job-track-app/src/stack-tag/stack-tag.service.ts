import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackTag } from './entities/stack-tag.entity';
import {
  CreateStackTagDto,
  UpdateStackTagDto,
  StackTagResponseDto,
} from './dto';

@Injectable()
export class StackTagService {
  private readonly logger = new Logger(StackTagService.name);

  constructor(
    @InjectRepository(StackTag)
    private readonly stackTagRepository: Repository<StackTag>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: StackTagResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const [stackTags, total] = await this.stackTagRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        data: stackTags.map((stackTag) => this.toResponseDto(stackTag)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching stack tags: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch stack tags');
    }
  }

  async findOne(id: number): Promise<StackTagResponseDto> {
    try {
      const stackTag = await this.stackTagRepository.findOne({ where: { id } });

      if (!stackTag) {
        throw new NotFoundException(`Stack tag with ID ${id} not found`);
      }

      return this.toResponseDto(stackTag);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching stack tag ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch stack tag');
    }
  }

  async create(createStackTagDto: CreateStackTagDto): Promise<StackTagResponseDto> {
    try {
      const stackTag = this.stackTagRepository.create(createStackTagDto);
      const savedStackTag = await this.stackTagRepository.save(stackTag);

      this.logger.log(`Stack tag created successfully with ID: ${savedStackTag.id}`);
      return this.toResponseDto(savedStackTag);
    } catch (error) {
      this.logger.error(`Error creating stack tag: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create stack tag');
    }
  }

  async update(id: number, updateStackTagDto: UpdateStackTagDto): Promise<StackTagResponseDto> {
    try {
      const stackTag = await this.stackTagRepository.findOne({ where: { id } });

      if (!stackTag) {
        throw new NotFoundException(`Stack tag with ID ${id} not found`);
      }

      Object.assign(stackTag, updateStackTagDto);
      const updatedStackTag = await this.stackTagRepository.save(stackTag);

      this.logger.log(`Stack tag with ID ${id} updated successfully`);
      return this.toResponseDto(updatedStackTag);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating stack tag ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update stack tag');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const stackTag = await this.stackTagRepository.findOne({ where: { id } });

      if (!stackTag) {
        throw new NotFoundException(`Stack tag with ID ${id} not found`);
      }

      await this.stackTagRepository.remove(stackTag);

      this.logger.log(`Stack tag with ID ${id} removed successfully`);
      return { message: `Stack tag with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing stack tag ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove stack tag');
    }
  }

  private toResponseDto(stackTag: StackTag): StackTagResponseDto {
    return {
      id: stackTag.id,
      label: stackTag.label,
      tagType: stackTag.tagType,
      createdAt: stackTag.createdAt,
    };
  }
}
