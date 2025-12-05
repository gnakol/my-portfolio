import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEvent } from './entities/application-event.entity';
import {
  CreateApplicationEventDto,
  UpdateApplicationEventDto,
  ApplicationEventResponseDto,
} from './dto';

@Injectable()
export class ApplicationEventService {
  private readonly logger = new Logger(ApplicationEventService.name);

  constructor(
    @InjectRepository(ApplicationEvent)
    private readonly applicationEventRepository: Repository<ApplicationEvent>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ApplicationEventResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [events, total] = await this.applicationEventRepository.findAndCount({
        skip,
        take: limit,
        order: { eventDate: 'DESC' },
      });

      return {
        data: events.map((event) => this.toResponseDto(event)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching application events: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch application events',
      );
    }
  }

  async findByCandidacy(
    candidacyId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ApplicationEventResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [events, total] = await this.applicationEventRepository.findAndCount({
        where: { candidacyId },
        skip,
        take: limit,
        order: { eventDate: 'DESC' },
      });

      return {
        data: events.map((event) => this.toResponseDto(event)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching events for candidacy ${candidacyId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch application events for candidacy',
      );
    }
  }

  async findOne(id: number): Promise<ApplicationEventResponseDto> {
    try {
      const event = await this.applicationEventRepository.findOne({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException(
          `Application event with ID ${id} not found`,
        );
      }

      return this.toResponseDto(event);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching application event ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch application event',
      );
    }
  }

  async create(
    createApplicationEventDto: CreateApplicationEventDto,
  ): Promise<ApplicationEventResponseDto> {
    try {
      const event = this.applicationEventRepository.create({
        ...createApplicationEventDto,
        eventDate: new Date(createApplicationEventDto.eventDate),
      });
      const savedEvent = await this.applicationEventRepository.save(event);

      this.logger.log(
        `Application event created successfully with ID: ${savedEvent.id}`,
      );
      return this.toResponseDto(savedEvent);
    } catch (error) {
      this.logger.error(
        `Error creating application event: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create application event',
      );
    }
  }

  async update(
    id: number,
    updateApplicationEventDto: UpdateApplicationEventDto,
  ): Promise<ApplicationEventResponseDto> {
    try {
      const event = await this.applicationEventRepository.findOne({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException(
          `Application event with ID ${id} not found`,
        );
      }

      const updateData: any = { ...updateApplicationEventDto };
      if (updateData.eventDate) {
        updateData.eventDate = new Date(updateData.eventDate);
      }

      Object.assign(event, updateData);
      const updatedEvent = await this.applicationEventRepository.save(event);

      this.logger.log(
        `Application event with ID ${id} updated successfully`,
      );
      return this.toResponseDto(updatedEvent);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating application event ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update application event',
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const event = await this.applicationEventRepository.findOne({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException(
          `Application event with ID ${id} not found`,
        );
      }

      await this.applicationEventRepository.remove(event);

      this.logger.log(
        `Application event with ID ${id} removed successfully`,
      );
      return {
        message: `Application event with ID ${id} has been successfully removed`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing application event ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to remove application event',
      );
    }
  }

  private toResponseDto(event: ApplicationEvent): ApplicationEventResponseDto {
    return {
      id: event.id,
      candidacyId: event.candidacyId,
      eventDate: event.eventDate,
      eventType: event.eventType,
      channel: event.channel,
      comment: event.comment,
      createdAt: event.createdAt,
    };
  }
}
