import { Campaign } from 'src/campaign/entities/campaign.entity';
import { Images } from 'src/image/entities/image.entity';
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
export class Criterion {
  @PrimaryGeneratedColumn()
  criteriaID: number;

  @Column()
  name: string;

  @Column()
  filename: string;

  @Column()
  guidelines: string;

  @ManyToOne((type) => Campaign, (campaign) => campaign.criteria)
  campaign: Campaign;

  @OneToMany((type) => Images, (image) => image.criterion)
  images: Images[];
}
