import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';

@Entity()
export class Images extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fileName: string;

  @Column({ type: 'datetime' })
  update: Date;

  @Column({ default: 'False' })
  override: string;

  @Column({ default: 'Pending' })
  verdict: string;

  @ManyToOne((type) => Audit, (audit) => audit.images)
  audit: Audit;
}
