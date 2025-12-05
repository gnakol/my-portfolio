import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity({ name: 'company' })
export class Company {
@PrimaryGeneratedColumn('increment', { name: 'id_company' })
id: number;

@Column({ length: 255 })
name: string;

@Column({ length: 255, nullable: true })
sector?: string;

@Column({ length: 255, nullable: true })
city?: string;

@Column({ length: 255, nullable: true })
country?: string;

@Column({ length: 512, nullable: true })
website?: string;

@Column({ type: 'text', nullable: true })
personal_note?: string;

@Column({ type: 'text', nullable: true })
recruiter_note?: string;

@CreateDateColumn({
name: 'created_at',
type: 'timestamptz',
default: () => 'NOW()',
  })
  created_at: Date;
}
