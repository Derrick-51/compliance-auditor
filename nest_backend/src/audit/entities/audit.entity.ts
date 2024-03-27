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
import { Users } from 'src/user/entities/user.entity';
import { Images } from 'src/image/entities/image.entity';
import { Campaign } from 'src/campaign/entities/campaign.entity';

@Entity()
export class Audit extends BaseEntity {
  @PrimaryGeneratedColumn()
  auditID: number;

  @Column({ default: 'Pending' })
  finalVerdict: string;

  @CreateDateColumn()
  submitDate: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) //for mssql { type: 'datetime' } //for postgres{ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" }
  update: Date;

  @ManyToOne((type) => Users, (user) => user.audits)
  user: Users;

  @ManyToOne((type) => Campaign, (campaign) => campaign.audits)
  @JoinColumn({ name: 'campaignID' })
  campaign: Campaign;

  @OneToMany((type) => Images, (image) => image.audit)
  images: Images[];
}
