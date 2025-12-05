import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';
import {
  CreateJobOfferDto,
  UpdateJobOfferDto,
  JobOfferResponseDto,
} from './dto';

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: JobOfferResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const [jobOffers, total] = await this.jobOfferRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['company'],
      });

      return {
        data: jobOffers.map((jobOffer) => this.toResponseDto(jobOffer)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching job offers: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch job offers');
    }
  }

  async findOne(id: number): Promise<JobOfferResponseDto> {
    try {
      const jobOffer = await this.jobOfferRepository.findOne({
        where: { id },
        relations: ['company'],
      });

      if (!jobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }

      return this.toResponseDto(jobOffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching job offer ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch job offer');
    }
  }

  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOfferResponseDto> {
    try {
      const jobOffer = this.jobOfferRepository.create(createJobOfferDto);
      const savedJobOffer = await this.jobOfferRepository.save(jobOffer);

      this.logger.log(`Job offer created successfully with ID: ${savedJobOffer.id}`);
      return this.toResponseDto(savedJobOffer);
    } catch (error) {
      this.logger.error(`Error creating job offer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create job offer');
    }
  }

  async update(id: number, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOfferResponseDto> {
    try {
      const jobOffer = await this.jobOfferRepository.findOne({ where: { id } });

      if (!jobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }

      Object.assign(jobOffer, updateJobOfferDto);
      const updatedJobOffer = await this.jobOfferRepository.save(jobOffer);

      this.logger.log(`Job offer with ID ${id} updated successfully`);
      return this.toResponseDto(updatedJobOffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating job offer ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update job offer');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const jobOffer = await this.jobOfferRepository.findOne({ where: { id } });

      if (!jobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }

      await this.jobOfferRepository.remove(jobOffer);

      this.logger.log(`Job offer with ID ${id} removed successfully`);
      return { message: `Job offer with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing job offer ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove job offer');
    }
  }

  private toResponseDto(jobOffer: JobOffer): JobOfferResponseDto {
    return {
      id: jobOffer.id,
      companyId: jobOffer.companyId,
      title: jobOffer.title,
      description: jobOffer.description,
      offerUrl: jobOffer.offerUrl,
      platform: jobOffer.platform,
      locationCity: jobOffer.locationCity,
      locationCountry: jobOffer.locationCountry,
      minSalary: jobOffer.minSalary,
      maxSalary: jobOffer.maxSalary,
      typeOfContract: jobOffer.typeOfContract,
      experienceLevel: jobOffer.experienceLevel,
      remoteMode: jobOffer.remoteMode,
      publicationDate: jobOffer.publicationDate,
      expirationDate: jobOffer.expirationDate,
      scrapedData: jobOffer.scrapedData,
      createdAt: jobOffer.createdAt,
    };
  }
}
