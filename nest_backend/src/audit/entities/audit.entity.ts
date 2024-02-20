import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Users } from 'src/user/entities/user.entity';

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  finalVerdit: string;

  @CreateDateColumn()
  auditDate: Date;

  @Column()
  dueDate: Date;

  @Column({ type: 'datetime' })
  update: Date;

  @ManyToOne((type) => Users, (user) => user.audit)
  user: Users;
}
