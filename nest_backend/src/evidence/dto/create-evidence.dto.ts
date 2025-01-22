import { IsNumber } from "class-validator";

export class CreateEvidenceDto {

    @IsNumber()
    criterionID: number;

    @IsNumber()
    auditID: number;
}
