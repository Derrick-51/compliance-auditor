import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  JoinColumn,
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

  @Column({ nullable: true })
  appeal: string;

  @Column({ default: '0' })
  override: boolean;

  @Column({ default: 'Pending' })
  verdict: string;

  @ManyToOne((type) => Audit, (audit) => audit.images)
  @JoinColumn({ name: 'auditID' }) //Specifies column that is being used as the foreign key
  audit: Audit;

  @ManyToOne((type) => Criterion, (criterion) => criterion.images)
  criterion: Criterion;
}
