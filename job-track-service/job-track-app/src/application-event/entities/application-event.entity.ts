import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Candidacy } from '../../candidacy/entities/candidacy.entity';

@Entity({ name: 'application_event' })
@Index(['candidacyId', 'eventDate'])
export class ApplicationEvent {
  @PrimaryGeneratedColumn('increment', { name: 'id_event' })
  id: number;

  @Column({ name: 'id_candidacy' })
  candidacyId: number;

  @ManyToOne(() => Candidacy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_candidacy' })
  candidacy: Candidacy;

  @Column({ name: 'event_date', type: 'timestamptz' })
  eventDate: Date;

  @Column({ name: 'event_type', length: 50 })
  eventType: string;

  @Column({ length: 50, nullable: true })
  channel?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
