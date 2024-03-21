import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';
import { Criterion } from 'src/criteria/entities/criterion.entity';

@Entity()
export class Images extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fileName: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) //for mssql type: 'datetime' //for postgres  type: "timestamptz"
  update: Date;

  @Column({ default: 'False' })
  override: string;

  @Column({ default: 'Pending' })
  verdict: string;

  @ManyToOne((type) => Audit, (audit) => audit.images)
  audit: Audit;

  @ManyToOne((type) => Criterion, (criterion) => criterion.images)
  criterion: Criterion;
}
