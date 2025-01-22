import { Audit } from 'src/audit/entities/audit.entity';
import { Criterion } from 'src/criteria/entities/criterion.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Campaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  campaignID: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany((type) => Audit, (audits) => audits.campaign)
  audits: Audit[];

  @OneToMany((type) => Criterion, (criterion) => criterion.campaign)
  criteria: Criterion[];
}
