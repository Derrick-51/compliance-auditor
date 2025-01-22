import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { Audit } from './entities/audit.entity';
import { Users } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from 'src/campaign/entities/campaign.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  async create(user: Users, campaign: Campaign): Promise<Audit> {
    return await this.auditRepository.save({ user, campaign });
  }

  async findOne(id: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      where: { auditID: id },
      select: ['auditID', 'finalVerdict', 'submitDate', 'update'],
      relations: { user: true, evidence: true },
    });
  }

  async findOneByUserCampaign(user: Users, campaign: Campaign) {
    return await this.auditRepository.findOne({
      where: { user: user, campaign: campaign },
    });
  }

  //find all audits in the current Campaign
  async findAll(campaignID: number): Promise<Audit[]> {
    const audits = await this.auditRepository.find({
      where: { campaign: { campaignID: campaignID } },
      select: ['auditID', 'finalVerdict', 'submitDate', 'update'], // Specify only required columns
      relations: ['user'], //show user tied to the audit
    });

    return audits;
  }

  async findOneWithEvidence(id: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      where: { auditID: id },
      relations: { evidence: true },
    });
  }

  async findCampaignAudit(userID: number, campaignID: number): Promise<Audit> {
    return await this.auditRepository.findOne({
      select: ['auditID', 'finalVerdict', 'submitDate', 'update'],
      where: {
        user: { id: userID },
        campaign: { campaignID: campaignID },
      },
      order: { auditID: 'DESC' }, // Gets last submitted audit
    });
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  //Update audit verdict based off evidence verdicts
  async updateFinalVerdict(auditID: number, finalVerdict: string) {
    return await this.auditRepository.update(
      { auditID: auditID },
      { finalVerdict: finalVerdict, update: new Date() },
    );
  }
}
