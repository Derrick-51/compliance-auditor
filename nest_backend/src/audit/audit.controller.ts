import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { UserService } from 'src/user/user.service';
import { CampaignService } from 'src/campaign/campaign.service';

@Controller('api/audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userService: UserService,
    private readonly campaignService: CampaignService,
  ) {}

  @Post()
  //Create user controller
  async create(@Body() createAuditDto: CreateAuditDto) {
    if (!createAuditDto.userEmail) {
      throw new HttpException('userEmail not provided', HttpStatus.BAD_REQUEST);
    }
    if (!createAuditDto.campaignID) {
      throw new HttpException(
        'campaignID not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    //find user based off of email
    const user = await this.userService.findOne(createAuditDto.userEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const campaign = await this.campaignService.findOne(
      createAuditDto.campaignID,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.auditService.create(user, campaign);
  }

  //list all audits under current campaign controller
  @Get('listall/:campaignID')
  findAll(@Param('campaignID') campaignID: number) {
    return this.auditService.findAll(campaignID);
  }

  //Find an audit through campaign and userID controller
  @Get('user/:userID/campaign/:campaignID')
  findCampaignAudit(
    @Param('userID') userID: number,
    @Param('campaignID') campaignID: number,
  ) {
    return this.auditService.findCampaignAudit(userID, campaignID);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }

  //Find user by campaign controller
  @Get('bycampaign')
  async findOneByUserCampaign(
    @Body('userEmail') userEmail: string,
    @Body('campaignID') campaignID: number,
  ) {
    if (!userEmail) {
      throw new HttpException('No userEmail in body', HttpStatus.BAD_REQUEST);
    }
    if (!campaignID) {
      throw new HttpException('No campaignID in body', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne(userEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const campaign = await this.campaignService.findOne(campaignID);
    if (!campaign) {
      throw new HttpException('Campaign not found', HttpStatus.BAD_REQUEST);
    }

    return await this.auditService.findOneByUserCampaign(user, campaign);
  }

  //update audit controller
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  //update audit verdict controller
  @Patch('update-final-verdict/:verdict/selected-audit/:auditID')
  updateFinalVerdict(
    @Param('auditID') auditID: number,
    @Param('verdict') finalVerdict: string,
  ) {
    return this.auditService.updateFinalVerdict(auditID, finalVerdict);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
