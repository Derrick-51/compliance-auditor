import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ReplOptions } from 'repl';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    return await this.campaignRepository.save(createCampaignDto);
  }

  findAll() {
    return `This action returns all campaign`;
  }

  async findOne(id: number) {
    return await this.campaignRepository.findOne({
      where: {campaignID: id},
      relations: {criteria: true}
    });
  }

  async findOneWithCriteria(id: number) {
    return await this.campaignRepository.findOne({
      where: {campaignID: id},
      relations: {criteria: true}
    });
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
