import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  finalVerdict: string;

  @CreateDateColumn()
  auditDate: Date;

  @Column()
  dueDate: Date;

  @Column({ type: 'datetime' })
  update: Date;

  @ManyToMany((type) => Users, (user) => user.audit)
  user: Users;

  @OneToMany((type) => Image, (image) => image.audit)
  image: Image;
}
