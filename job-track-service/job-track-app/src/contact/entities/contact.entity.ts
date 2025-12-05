import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity({ name: 'contact' })
export class Contact {
  @PrimaryGeneratedColumn('increment', { name: 'id_contact' })
  id: number;

  @Column({ name: 'id_company' })
  companyId: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_company' })
  company: Company;

  @Column({ name: 'first_name', length: 255, nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', length: 255, nullable: true })
  lastName?: string;

  @Column({ length: 255, nullable: true })
  role?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ name: 'linkedin_url', length: 512, nullable: true })
  linkedinUrl?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
