import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import {
  CreateReminderDto,
  UpdateReminderDto,
  ReminderResponseDto,
} from './dto';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ReminderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [reminders, total] = await this.reminderRepository.findAndCount({
        skip,
        take: limit,
        relations: ['candidacy'],
        order: { createdAt: 'DESC' },
      });

      return {
        data: reminders.map((reminder) => this.toResponseDto(reminder)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching reminders: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch reminders');
    }
  }

  async findOne(id: number): Promise<ReminderResponseDto> {
    try {
      const reminder = await this.reminderRepository.findOne({
        where: { id },
        relations: ['candidacy'],
      });

      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${id} not found`);
      }

      return this.toResponseDto(reminder);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching reminder ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch reminder');
    }
  }

  async findByCandidacyId(
    candidacyId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ReminderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [reminders, total] = await this.reminderRepository.findAndCount({
        where: { candidacyId },
        skip,
        take: limit,
        relations: ['candidacy'],
        order: { dueDate: 'DESC' },
      });

      return {
        data: reminders.map((reminder) => this.toResponseDto(reminder)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching reminders for candidacy ${candidacyId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch reminders');
    }
  }

  async create(createReminderDto: CreateReminderDto): Promise<ReminderResponseDto> {
    try {
      const reminder = this.reminderRepository.create(createReminderDto);
      const savedReminder = await this.reminderRepository.save(reminder);

      this.logger.log(`Reminder created successfully with ID: ${savedReminder.id}`);
      return this.toResponseDto(savedReminder);
    } catch (error) {
      this.logger.error(`Error creating reminder: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create reminder');
    }
  }

  async update(
    id: number,
    updateReminderDto: UpdateReminderDto,
  ): Promise<ReminderResponseDto> {
    try {
      const reminder = await this.reminderRepository.findOne({ where: { id } });

      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${id} not found`);
      }

      Object.assign(reminder, updateReminderDto);
      const updatedReminder = await this.reminderRepository.save(reminder);

      this.logger.log(`Reminder with ID ${id} updated successfully`);
      return this.toResponseDto(updatedReminder);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating reminder ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update reminder');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const reminder = await this.reminderRepository.findOne({ where: { id } });

      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${id} not found`);
      }

      await this.reminderRepository.remove(reminder);

      this.logger.log(`Reminder with ID ${id} removed successfully`);
      return { message: `Reminder with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing reminder ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove reminder');
    }
  }

  private toResponseDto(reminder: Reminder): ReminderResponseDto {
    return {
      id: reminder.id,
      candidacyId: reminder.candidacyId,
      dueDate: reminder.dueDate,
      reminderType: reminder.reminderType,
      status: reminder.status,
      comment: reminder.comment,
      autoGenerated: reminder.autoGenerated,
      createdAt: reminder.createdAt,
    };
  }
}
