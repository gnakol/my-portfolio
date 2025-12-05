import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
} from './dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: CompanyResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const [companies, total] = await this.companyRepository.findAndCount({
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      return {
        data: companies.map((company) => this.toResponseDto(company)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching companies: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch companies');
    }
  }

  async findOne(id: number): Promise<CompanyResponseDto> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });

      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      return this.toResponseDto(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching company ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch company');
    }
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto> {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      const savedCompany = await this.companyRepository.save(company);

      this.logger.log(`Company created successfully with ID: ${savedCompany.id}`);
      return this.toResponseDto(savedCompany);
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });

      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      Object.assign(company, updateCompanyDto);
      const updatedCompany = await this.companyRepository.save(company);

      this.logger.log(`Company with ID ${id} updated successfully`);
      return this.toResponseDto(updatedCompany);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating company ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });

      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      await this.companyRepository.remove(company);

      this.logger.log(`Company with ID ${id} removed successfully`);
      return { message: `Company with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing company ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove company');
    }
  }

  private toResponseDto(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      sector: company.sector,
      city: company.city,
      country: company.country,
      website: company.website,
      personal_note: company.personal_note,
      recruiter_note: company.recruiter_note,
      created_at: company.created_at,
    };
  }
}
