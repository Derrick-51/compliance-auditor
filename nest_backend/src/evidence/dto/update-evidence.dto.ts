import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenceDto } from './create-evidence.dto';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {
  @IsString()
  verdict: string;

  @IsBoolean()
  override: boolean;

  @IsDate()
  update: Date;
}
