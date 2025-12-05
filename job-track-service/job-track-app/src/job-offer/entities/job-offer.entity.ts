import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity({ name: 'job_offer' })
export class JobOffer {
  @PrimaryGeneratedColumn('increment', { name: 'id_job_offer' })
  id: number;

  @Column({ name: 'id_company' })
  companyId: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_company' })
  company: Company;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'offer_url', length: 1024, nullable: true, unique: true })
  offerUrl?: string;

  @Column({ length: 100, nullable: true })
  platform?: string;

  @Column({ name: 'location_city', length: 255, nullable: true })
  locationCity?: string;

  @Column({ name: 'location_country', length: 255, nullable: true })
  locationCountry?: string;

  @Column({ name: 'min_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  minSalary?: number;

  @Column({ name: 'max_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxSalary?: number;

  @Column({ name: 'type_of_contract', length: 100, nullable: true })
  typeOfContract?: string;

  @Column({ name: 'experience_level', length: 100, nullable: true })
  experienceLevel?: string;

  @Column({ name: 'remote_mode', length: 50, nullable: true })
  remoteMode?: string;

  @Column({ name: 'publication_date', type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({ name: 'scraped_data', type: 'jsonb', nullable: true })
  scrapedData?: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
