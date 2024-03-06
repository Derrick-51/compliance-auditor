import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';

@Entity()
export class Images {
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

  @ManyToOne((type) => Audit, (audit) => audit.image)
  audit: Audit;
}
