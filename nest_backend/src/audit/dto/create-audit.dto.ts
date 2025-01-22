import { IsNumber, IsString } from "class-validator";

export class CreateAuditDto {
    @IsString()
    userEmail: string;

    @IsNumber()
    campaignID: number;
}
