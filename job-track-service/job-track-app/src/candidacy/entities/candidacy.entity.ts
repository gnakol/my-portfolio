import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { JobOffer } from '../../job-offer/entities/job-offer.entity';

@Entity({ name: 'candidacy' })
@Index(['jobOfferId'], { unique: true, where: 'id_job_offer IS NOT NULL' })
export class Candidacy {
  @PrimaryGeneratedColumn('increment', { name: 'id_candidacy' })
  id: number;

  @Column({ name: 'id_company' })
  companyId: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_company' })
  company: Company;

  @Column({ name: 'id_job_offer', nullable: true })
  jobOfferId?: number;

  @ManyToOne(() => JobOffer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_job_offer' })
  jobOffer?: JobOffer;

  @Column({ name: 'application_date', type: 'date' })
  applicationDate: Date;

  @Column({ name: 'current_status', length: 50 })
  currentStatus: string;

  @Column({ name: 'application_channel', length: 50, nullable: true })
  applicationChannel?: string;

  @Column({ name: 'expected_min_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  expectedMinSalary?: number;

  @Column({ name: 'expected_max_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  expectedMaxSalary?: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'level_of_interest', type: 'smallint', nullable: true })
  levelOfInterest?: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
