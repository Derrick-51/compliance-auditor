import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { Criterion } from './entities/criterion.entity';
import { Campaign } from '../campaign/entities/campaign.entity';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criterion)
    @InjectRepository(Campaign)
    private criteriaRepository: Repository<Criterion>,
  ) {}

  async create(campaign: Campaign): Promise<Criterion> {
    return this.criteriaRepository.save({campaign})
  }

  findAll() {
    return `This action returns all criteria`;
  }

  async findOne(id: number): Promise<Criterion> {
    return await this.criteriaRepository.findOne({
      where: {criteriaID: id}
    });
  }

  async update(
    updateCriterionDto: UpdateCriterionDto,
    filename: string,
    criterion: Criterion,
    ): Promise<Criterion> {

    

    // Don't replace filename if no file uploaded
    if(filename.length > 0) {
      Object.assign(criterion, {filename: filename});
    }

    Object.assign(criterion, updateCriterionDto);
    await criterion.save();

    return criterion;
  }

  remove(id: number) {
    return `This action removes a #${id} criterion`;
  }
}