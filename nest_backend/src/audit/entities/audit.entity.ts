import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import { Images } from 'src/image/entities/image.entity';

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Pending' })
  finalVerdict: string;

  @CreateDateColumn()
  auditDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime' })
  update: Date;

  @ManyToOne((type) => Users, (user) => user.audits)
  user: Users;

  @OneToMany((type) => Images, (image) => image.audit)
  images: Images[];
}
