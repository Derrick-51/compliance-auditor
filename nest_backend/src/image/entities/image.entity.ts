import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fileName: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" }) //for mssql { type: 'datetime' }
  update: Date;

  @Column()
  override: string;

  @Column()
  verdict: string;

  @ManyToOne((type) => Audit, (audit) => audit.image)
  audit: Audit;
}
