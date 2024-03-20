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
export class Campaign {
  @PrimaryGeneratedColumn()
  campaignID: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany((type) => Audit, (audits) => audits.campaign)
  audits: Audit[];

  @OneToMany((type) => Criterion, (criterion) => criterion.campaign)
  criterion: Criterion[];
}
