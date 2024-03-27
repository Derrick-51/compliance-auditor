import { IsNumber } from "class-validator";

export class CreateImageDto {

    @IsNumber()
    criterionID: number;

    @IsNumber()
    auditID: number;
}
