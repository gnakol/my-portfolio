import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
} from './dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ContactResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const [contacts, total] = await this.contactRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        data: contacts.map((contact) => this.toResponseDto(contact)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error fetching contacts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch contacts');
    }
  }

  async findOne(id: number): Promise<ContactResponseDto> {
    try {
      const contact = await this.contactRepository.findOne({ where: { id } });

      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      return this.toResponseDto(contact);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching contact ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch contact');
    }
  }

  async create(createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    try {
      const contact = this.contactRepository.create(createContactDto);
      const savedContact = await this.contactRepository.save(contact);

      this.logger.log(`Contact created successfully with ID: ${savedContact.id}`);
      return this.toResponseDto(savedContact);
    } catch (error) {
      this.logger.error(`Error creating contact: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create contact');
    }
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<ContactResponseDto> {
    try {
      const contact = await this.contactRepository.findOne({ where: { id } });

      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      Object.assign(contact, updateContactDto);
      const updatedContact = await this.contactRepository.save(contact);

      this.logger.log(`Contact with ID ${id} updated successfully`);
      return this.toResponseDto(updatedContact);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating contact ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update contact');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const contact = await this.contactRepository.findOne({ where: { id } });

      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      await this.contactRepository.remove(contact);

      this.logger.log(`Contact with ID ${id} removed successfully`);
      return { message: `Contact with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing contact ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to remove contact');
    }
  }

  private toResponseDto(contact: Contact): ContactResponseDto {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      linkedinUrl: contact.linkedinUrl,
      notes: contact.notes,
      createdAt: contact.createdAt,
    };
  }
}
