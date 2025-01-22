import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll() {
    return await this.campaignRepository.find();
  }

  async findLatest() {
    return await this.campaignRepository.findOne({
      where: {campaignID: undefined}, // Select condition required
      order: {campaignID: 'DESC'}
    });
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

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  async delete(id: number) {
    const deletedCampaign = await this.campaignRepository.findOne({
      where: {campaignID: id},
      relations: {criteria: true}
    });

    if(!deletedCampaign) {
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.campaignRepository.delete({campaignID: id});
    }
    catch(err) {
      if(err.code == 'EREQUEST') {
        throw new HttpException('Campaign is currently in use by an audit', HttpStatus.CONFLICT)
      }
    }
    return deletedCampaign
  }
}
