import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditDto } from './create-audit.dto';
import { IsDate, IsString } from 'class-validator';

export class UpdateAuditDto extends PartialType(CreateAuditDto) {
  @IsString()
  finalVerdict: string;

  @IsDate()
  update: Date;
}
