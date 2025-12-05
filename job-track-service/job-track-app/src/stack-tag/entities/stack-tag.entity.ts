import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'stack_tag' })
@Index(['label', 'tagType'], { unique: true })
export class StackTag {
  @PrimaryGeneratedColumn('increment', { name: 'id_tag' })
  id: number;

  @Column({ length: 100 })
  label: string;

  @Column({ name: 'tag_type', length: 50, nullable: true })
  tagType?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
