import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { Criterion } from './entities/criterion.entity';
import { Campaign } from '../campaign/entities/campaign.entity';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criterion)
    @InjectRepository(Campaign)
    private criterionRepository: Repository<Criterion>,
  ) {}

  async create(createCriterionDto: CreateCriterionDto, filename: string, campaign: Campaign): Promise<Criterion> {

    const newCriterion = await this.criterionRepository.save({
      name: createCriterionDto.name,
      filename: filename,
      guidelines: createCriterionDto.guidelines,
    });

    // Attach campaign to criterion
    campaign.criteria = [...campaign.criteria, newCriterion];
    await campaign.save();

    return newCriterion;
  }

  findAll() {
    return `This action returns all criteria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} criterion`;
  }

  update(id: number, updateCriterionDto: UpdateCriterionDto) {
    return `This action updates a #${id} criterion`;
  }

  remove(id: number) {
    return `This action removes a #${id} criterion`;
  }
}