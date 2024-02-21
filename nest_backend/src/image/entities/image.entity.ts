import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fileName: string;

  @Column({ type: 'datetime' })
  update: Date;

  @Column()
  override: string;

  @Column()
  verdict: string;

  @ManyToOne((type) => Audit, (audit) => audit.image)
  audit: Audit;
}
