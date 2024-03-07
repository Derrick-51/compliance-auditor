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

  @Column()
  finalVerdict: string;

  @CreateDateColumn()
  auditDate: Date;

  @Column()
  dueDate: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) //for mssql { type: 'datetime' } //for postgres{ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" }
  update: Date;

  @ManyToOne((type) => Users, (user) => user.audit)
  user: Users;

  @OneToMany((type) => Images, (image) => image.audit)
  image: Images;
}
