import { Campaign } from 'src/campaign/entities/campaign.entity';
import { Evidence } from 'src/evidence/entities/evidence.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Criterion extends BaseEntity {
  @PrimaryGeneratedColumn()
  criteriaID: number;

  @Column({ default: 'New Criterion' })
  name: string;

  @Column({ default: '' })
  filename: string;

  @Column({ default: '', length:1000 })
  guidelines: string;

  @ManyToOne((type) => Campaign, (campaign) => campaign.criteria, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaignID' })
  campaign: Campaign;

  @OneToMany((type) => Evidence, (evidence) => evidence.criterion)
  evidence: Evidence[];
}
