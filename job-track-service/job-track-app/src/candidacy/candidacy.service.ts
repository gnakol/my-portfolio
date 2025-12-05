import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidacy } from './entities/candidacy.entity';
import { Company } from '../company/entities/company.entity';
import { JobOffer } from '../job-offer/entities/job-offer.entity';
import {
  CreateCandidacyDto,
  UpdateCandidacyDto,
  CandidacyResponseDto,
} from './dto';

@Injectable()
export class CandidacyService {
  private readonly logger = new Logger(CandidacyService.name);

  constructor(
    @InjectRepository(Candidacy)
    private readonly candidacyRepository: Repository<Candidacy>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: CandidacyResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const [candidacies, total] = await this.candidacyRepository.findAndCount({
        skip,
        take: limit,
        relations: ['company', 'jobOffer'],
        order: { createdAt: 'DESC' },
      });

      return {
        data: candidacies.map((candidacy) => this.toResponseDto(candidacy)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching candidacies: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch candidacies');
    }
  }

  async findOne(id: number): Promise<CandidacyResponseDto> {
    try {
      const candidacy = await this.candidacyRepository.findOne({
        where: { id },
        relations: ['company', 'jobOffer'],
      });

      if (!candidacy) {
        throw new NotFoundException(`Candidacy with ID ${id} not found`);
      }

      return this.toResponseDto(candidacy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching candidacy ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch candidacy');
    }
  }

  async create(createCandidacyDto: CreateCandidacyDto): Promise<CandidacyResponseDto> {
    try {
      // Verify company exists
      const company = await this.companyRepository.findOne({
        where: { id: createCandidacyDto.companyId },
      });

      if (!company) {
        throw new BadRequestException(
          `Company with ID ${createCandidacyDto.companyId} not found`,
        );
      }

      // Verify jobOffer exists if provided
      if (createCandidacyDto.jobOfferId) {
        const jobOffer = await this.jobOfferRepository.findOne({
          where: { id: createCandidacyDto.jobOfferId },
        });

        if (!jobOffer) {
          throw new BadRequestException(
            `JobOffer with ID ${createCandidacyDto.jobOfferId} not found`,
          );
        }
      }

      const candidacy = this.candidacyRepository.create(createCandidacyDto);
      const savedCandidacy = await this.candidacyRepository.save(candidacy);

      // Load relations
      const candidacyWithRelations = await this.candidacyRepository.findOne({
        where: { id: savedCandidacy.id },
        relations: ['company', 'jobOffer'],
      });

      if (!candidacyWithRelations) {
        throw new InternalServerErrorException('Failed to retrieve created candidacy');
      }

      this.logger.log(`Candidacy created successfully with ID: ${savedCandidacy.id}`);
      return this.toResponseDto(candidacyWithRelations);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error creating candidacy: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create candidacy');
    }
  }

  async update(
    id: number,
    updateCandidacyDto: UpdateCandidacyDto,
  ): Promise<CandidacyResponseDto> {
    try {
      const candidacy = await this.candidacyRepository.findOne({ where: { id } });

      if (!candidacy) {
        throw new NotFoundException(`Candidacy with ID ${id} not found`);
      }

      // Verify company exists if being updated
      if (updateCandidacyDto.companyId) {
        const company = await this.companyRepository.findOne({
          where: { id: updateCandidacyDto.companyId },
        });

        if (!company) {
          throw new BadRequestException(
            `Company with ID ${updateCandidacyDto.companyId} not found`,
          );
        }
      }

      // Verify jobOffer exists if being updated
      if (updateCandidacyDto.jobOfferId) {
        const jobOffer = await this.jobOfferRepository.findOne({
          where: { id: updateCandidacyDto.jobOfferId },
        });

        if (!jobOffer) {
          throw new BadRequestException(
            `JobOffer with ID ${updateCandidacyDto.jobOfferId} not found`,
          );
        }
      }

      Object.assign(candidacy, updateCandidacyDto);
      const updatedCandidacy = await this.candidacyRepository.save(candidacy);

      // Load relations
      const candidacyWithRelations = await this.candidacyRepository.findOne({
        where: { id: updatedCandidacy.id },
        relations: ['company', 'jobOffer'],
      });

      if (!candidacyWithRelations) {
        throw new InternalServerErrorException('Failed to retrieve updated candidacy');
      }

      this.logger.log(`Candidacy with ID ${id} updated successfully`);
      return this.toResponseDto(candidacyWithRelations);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error updating candidacy ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update candidacy');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const candidacy = await this.candidacyRepository.findOne({ where: { id } });

      if (!candidacy) {
        throw new NotFoundException(`Candidacy with ID ${id} not found`);
      }

      await this.candidacyRepository.remove(candidacy);

      this.logger.log(`Candidacy with ID ${id} removed successfully`);
      return { message: `Candidacy with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing candidacy ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to remove candidacy');
    }
  }

  private toResponseDto(candidacy: Candidacy): CandidacyResponseDto {
    return {
      id: candidacy.id,
      companyId: candidacy.companyId,
      jobOfferId: candidacy.jobOfferId,
      applicationDate: candidacy.applicationDate,
      currentStatus: candidacy.currentStatus,
      applicationChannel: candidacy.applicationChannel,
      expectedMinSalary: candidacy.expectedMinSalary,
      expectedMaxSalary: candidacy.expectedMaxSalary,
      note: candidacy.note,
      levelOfInterest: candidacy.levelOfInterest,
      createdAt: candidacy.createdAt,
      company: candidacy.company
        ? {
            id: candidacy.company.id,
            name: candidacy.company.name,
            sector: candidacy.company.sector,
            city: candidacy.company.city,
            country: candidacy.company.country,
            website: candidacy.company.website,
            personal_note: candidacy.company.personal_note,
            recruiter_note: candidacy.company.recruiter_note,
            created_at: candidacy.company.created_at,
          }
        : undefined,
      jobOffer: candidacy.jobOffer
        ? {
            id: candidacy.jobOffer.id,
            title: candidacy.jobOffer.title,
            description: candidacy.jobOffer.description,
            companyId: candidacy.jobOffer.companyId,
          }
        : undefined,
    };
  }
}
