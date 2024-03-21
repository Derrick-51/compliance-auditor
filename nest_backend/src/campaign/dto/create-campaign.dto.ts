import { IsDate } from "class-validator";

export class CreateCampaignDto {
    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;
}
