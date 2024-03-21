import { IsString, IsNumber } from "class-validator";

export class CreateCriterionDto {
    @IsString()
    name: string;

    @IsString()
    guidelines: string;

    @IsNumber()
    campaignID: number;
}
