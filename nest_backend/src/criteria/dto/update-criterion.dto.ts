import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCriterionDto } from './create-criterion.dto';

// Prevent changing a criterion's campaign on update
export class UpdateCriterionDto extends PartialType(
    OmitType(CreateCriterionDto, ['campaignID'] as const),
    ) {
  criteriaID: number;
  filename: string;
}
