import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, Between } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import {
  CreateReminderDto,
  UpdateReminderDto,
  ReminderResponseDto,
  ReminderDashboardDto,
  SnoozeReminderDto,
  CompleteReminderDto,
} from './dto';
import { ReminderStatus, ReminderPriority } from './enums';

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

  /**
   * Dashboard intelligent avec statistiques et reminders critiques
   * Filtre intelligemment selon le statut de la candidature
   */
  async getDashboard(): Promise<ReminderDashboardDto> {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(endOfToday.getDate() + 1);

      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      // Récupérer tous les reminders PENDING ou SNOOZED avec leur candidature
      const allReminders = await this.reminderRepository.find({
        where: {
          status: In([ReminderStatus.PENDING, ReminderStatus.SNOOZED]),
        },
        relations: ['candidacy', 'candidacy.company', 'candidacy.jobOffer'],
        order: { dueDate: 'ASC' },
      });

      // 🔥 FILTRAGE INTELLIGENT : Ne garder que les candidatures qui nécessitent un suivi
      // Statuts qui nécessitent des reminders (pas de réponse de l'employeur)
      const STATUS_NEEDING_FOLLOWUP = ['SENT', 'UNDER_REVIEW', 'VIEWED'];

      // Statuts en cours (entretiens programmés, en attente) - reminders en pause
      const STATUS_IN_PROGRESS = [
        'PHONE_SCREENING',
        'INTERVIEW_SCHEDULED',
        'TECHNICAL_TEST',
        'FINAL_INTERVIEW',
      ];

      // Statuts finaux (déjà une réponse) - reminders à annuler
      const STATUS_FINAL = [
        'ACCEPTED',
        'OFFER_RECEIVED',
        'REJECTED',
        'WITHDRAWN',
        'EXPIRED',
      ];

      // Filtrer les reminders pertinents (seulement pour les candidatures sans réponse)
      const relevantReminders = allReminders.filter((reminder) => {
        const candidacyStatus = reminder.candidacy?.currentStatus || 'UNKNOWN';
        return STATUS_NEEDING_FOLLOWUP.includes(candidacyStatus);
      });

      // 🧠 CALCUL INTELLIGENT DE LA PRIORITÉ pour chaque reminder
      const remindersWithPriority = await Promise.all(
        relevantReminders.map(async (reminder) => {
          const newPriority = this.calculateIntelligentPriority(
            reminder,
            now,
            startOfToday,
            endOfToday,
          );

          // Mettre à jour la priorité si elle a changé
          if (reminder.priority !== newPriority) {
            reminder.priority = newPriority;
            await this.reminderRepository.save(reminder);
          }

          return reminder;
        }),
      );

      // 🗑️ AUTO-ANNULATION : Annuler les reminders pour candidatures finales ou en cours
      const remindersToCancel = allReminders.filter((reminder) => {
        const candidacyStatus = reminder.candidacy?.currentStatus || 'UNKNOWN';
        return STATUS_FINAL.includes(candidacyStatus) || STATUS_IN_PROGRESS.includes(candidacyStatus);
      });

      for (const reminder of remindersToCancel) {
        if (reminder.status !== ReminderStatus.CANCELLED) {
          reminder.status = ReminderStatus.CANCELLED;
          reminder.comment = `Auto-annulé: candidature ${reminder.candidacy?.currentStatus}`;
          await this.reminderRepository.save(reminder);
          this.logger.log(
            `Reminder ${reminder.id} auto-cancelled for candidacy ${reminder.candidacyId} (status: ${reminder.candidacy?.currentStatus})`,
          );
        }
      }

      // Calculer les statistiques sur les reminders pertinents uniquement
      const overdue = remindersWithPriority.filter((r) => new Date(r.dueDate) < now).length;
      const today = remindersWithPriority.filter(
        (r) => new Date(r.dueDate) >= startOfToday && new Date(r.dueDate) < endOfToday,
      ).length;
      const thisWeek = remindersWithPriority.filter(
        (r) => new Date(r.dueDate) >= startOfToday && new Date(r.dueDate) < endOfWeek,
      ).length;
      const upcoming = remindersWithPriority.filter((r) => new Date(r.dueDate) >= endOfWeek).length;

      // Compter par priorité (après recalcul)
      const byPriority = {
        CRITICAL: remindersWithPriority.filter((r) => r.priority === ReminderPriority.CRITICAL)
          .length,
        HIGH: remindersWithPriority.filter((r) => r.priority === ReminderPriority.HIGH).length,
        MEDIUM: remindersWithPriority.filter((r) => r.priority === ReminderPriority.MEDIUM).length,
        LOW: remindersWithPriority.filter((r) => r.priority === ReminderPriority.LOW).length,
      };

      // Compter par status de candidature (seulement les pertinents)
      const byCandidacyStatus: { [key: string]: number } = {};
      remindersWithPriority.forEach((reminder) => {
        const status = reminder.candidacy?.currentStatus || 'UNKNOWN';
        byCandidacyStatus[status] = (byCandidacyStatus[status] || 0) + 1;
      });

      // Récupérer les reminders critiques et urgents
      const criticalReminders = remindersWithPriority
        .filter(
          (r) =>
            (r.priority === ReminderPriority.CRITICAL || r.priority === ReminderPriority.HIGH) &&
            new Date(r.dueDate) <= endOfWeek, // Cette semaine
        )
        .sort((a, b) => {
          // Trier par priorité puis par date
          const priorityOrder = {
            CRITICAL: 0,
            HIGH: 1,
            MEDIUM: 2,
            LOW: 3,
          };
          const priorityDiff =
            priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .slice(0, 10) // Top 10
        .map((r) => this.toResponseDto(r));

      this.logger.log(
        `Dashboard: ${remindersWithPriority.length} relevant reminders, ${remindersToCancel.length} cancelled`,
      );

      return {
        summary: {
          total: remindersWithPriority.length,
          overdue,
          today,
          thisWeek,
          upcoming,
        },
        byPriority,
        byCandidacyStatus,
        criticalReminders,
      };
    } catch (error) {
      this.logger.error(`Error fetching dashboard: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch dashboard');
    }
  }

  /**
   * Calcule intelligemment la priorité d'un reminder en fonction de:
   * - La date (en retard, aujourd'hui, cette semaine)
   * - Le statut de la candidature
   * - Le type de reminder
   */
  private calculateIntelligentPriority(
    reminder: Reminder,
    now: Date,
    startOfToday: Date,
    endOfToday: Date,
  ): ReminderPriority {
    const dueDate = new Date(reminder.dueDate);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const candidacyStatus = reminder.candidacy?.currentStatus;

    // 🔴 CRITIQUE: En retard de 3+ jours ET candidature sans réponse
    if (diffDays <= -3 && ['SENT', 'UNDER_REVIEW', 'VIEWED'].includes(candidacyStatus)) {
      return ReminderPriority.CRITICAL;
    }

    // 🟠 URGENT: En retard de 1-2 jours OU aujourd'hui ET candidature sans réponse
    if (
      (diffDays >= -2 && diffDays < 0) ||
      (dueDate >= startOfToday && dueDate < endOfToday)
    ) {
      if (['SENT', 'UNDER_REVIEW'].includes(candidacyStatus)) {
        return ReminderPriority.HIGH;
      }
    }

    // 🟡 MOYEN: Dans les 3 prochains jours
    if (diffDays > 0 && diffDays <= 3) {
      return ReminderPriority.MEDIUM;
    }

    // 🟢 BAS: Plus tard
    return ReminderPriority.LOW;
  }

  /**
   * Reporter un reminder de X jours
   */
  async snooze(id: number, snoozeDto: SnoozeReminderDto): Promise<ReminderResponseDto> {
    try {
      const reminder = await this.reminderRepository.findOne({ where: { id } });

      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${id} not found`);
      }

      if (reminder.status === ReminderStatus.COMPLETED) {
        throw new BadRequestException('Cannot snooze a completed reminder');
      }

      // Sauvegarder la date originale si c'est la première fois qu'on snooze
      if (!reminder.originalDueDate) {
        reminder.originalDueDate = reminder.dueDate;
      }

      // Calculer la nouvelle date
      const newDueDate = new Date(reminder.dueDate);
      newDueDate.setDate(newDueDate.getDate() + snoozeDto.snoozeDays);

      reminder.dueDate = newDueDate;
      reminder.snoozedUntil = newDueDate;
      reminder.status = ReminderStatus.SNOOZED;

      const updatedReminder = await this.reminderRepository.save(reminder);

      this.logger.log(
        `Reminder ${id} snoozed for ${snoozeDto.snoozeDays} days until ${newDueDate.toISOString()}`,
      );

      return this.toResponseDto(updatedReminder);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error snoozing reminder ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to snooze reminder');
    }
  }

  /**
   * Marquer un reminder comme complété
   */
  async complete(
    id: number,
    completeDto?: CompleteReminderDto,
  ): Promise<ReminderResponseDto> {
    try {
      const reminder = await this.reminderRepository.findOne({ where: { id } });

      if (!reminder) {
        throw new NotFoundException(`Reminder with ID ${id} not found`);
      }

      if (reminder.status === ReminderStatus.COMPLETED) {
        throw new BadRequestException('Reminder is already completed');
      }

      reminder.status = ReminderStatus.COMPLETED;
      reminder.completedAt = new Date();

      if (completeDto?.comment) {
        reminder.comment = completeDto.comment;
      }

      const updatedReminder = await this.reminderRepository.save(reminder);

      this.logger.log(`Reminder ${id} marked as completed`);

      return this.toResponseDto(updatedReminder);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error completing reminder ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to complete reminder');
    }
  }

  /**
   * Recalculer automatiquement les priorités des reminders
   * Appelé par un cron job ou manuellement
   */
  async updatePriorities(): Promise<{ updated: number }> {
    try {
      const now = new Date();
      const reminders = await this.reminderRepository.find({
        where: {
          status: In([ReminderStatus.PENDING, ReminderStatus.SNOOZED]),
        },
        relations: ['candidacy'],
      });

      let updated = 0;

      for (const reminder of reminders) {
        const dueDate = new Date(reminder.dueDate);
        const diffTime = now.getTime() - dueDate.getTime();
        const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const candidacyStatus = reminder.candidacy?.currentStatus || '';
        const importantStatuses = ['SENT', 'UNDER_REVIEW', 'PHONE_SCREENING'];

        let newPriority: ReminderPriority;

        // Logique intelligente de calcul de priorité
        if (daysOverdue >= 3 && importantStatuses.includes(candidacyStatus)) {
          newPriority = ReminderPriority.CRITICAL;
        } else if (
          (daysOverdue >= 1 && daysOverdue < 3) ||
          (daysOverdue === 0 && importantStatuses.includes(candidacyStatus))
        ) {
          newPriority = ReminderPriority.HIGH;
        } else if (daysOverdue < 0 && Math.abs(daysOverdue) <= 7) {
          newPriority = ReminderPriority.MEDIUM;
        } else {
          newPriority = ReminderPriority.LOW;
        }

        if (reminder.priority !== newPriority) {
          reminder.priority = newPriority;
          await this.reminderRepository.save(reminder);
          updated++;
        }
      }

      this.logger.log(`Updated priorities for ${updated} reminders`);
      return { updated };
    } catch (error) {
      this.logger.error(`Error updating priorities: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update priorities');
    }
  }

  private toResponseDto(reminder: Reminder): ReminderResponseDto {
    const now = new Date();
    const dueDate = new Date(reminder.dueDate);
    const diffTime = now.getTime() - dueDate.getTime();
    const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      id: reminder.id,
      candidacyId: reminder.candidacyId,
      dueDate: reminder.dueDate,
      reminderType: reminder.reminderType,
      status: reminder.status,
      priority: reminder.priority,
      comment: reminder.comment,
      autoGenerated: reminder.autoGenerated,
      snoozedUntil: reminder.snoozedUntil,
      completedAt: reminder.completedAt,
      originalDueDate: reminder.originalDueDate,
      createdAt: reminder.createdAt,
      // Champs calculés
      daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
      isOverdue: daysOverdue > 0,
      candidacy: reminder.candidacy,
    };
  }
}
