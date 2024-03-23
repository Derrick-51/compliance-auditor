import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(campaign: Campaign): Promise<Criterion> {

    const newCriterion = await this.criterionRepository.save({});
    // Attach campaign to criterion
    campaign.criteria = [...campaign.criteria, newCriterion];
    await campaign.save();

    return newCriterion;
  }

  async findAll(): Promise<Criterion[]> {
    return await this.criterionRepository.find();
  }

  async findOne(id: number): Promise<Criterion> {
    return await this.criterionRepository.findOne({
      where: {criteriaID: id}
    });
  }

  async update(
    id: number,
    updateCriterionDto: UpdateCriterionDto,
    filename: string
    ): Promise<Criterion> {

    let criterion = await this.criterionRepository.findOne({
      where: {criteriaID: id}
    });
    if(!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }

    // Don't replace filename if no file uploaded
    if(filename.length > 0) {
      Object.assign(criterion, {filename: filename});
    }

    Object.assign(criterion, updateCriterionDto);
    await criterion.save();

    return criterion;
  }

  async updateAll(criteria: UpdateCriterionDto[]): Promise<Criterion[]> {
  const updatedCriteria = await Promise.all(criteria.map(async criterion => {
    // Update each criterion
    const updatedCriterion = await this.update(criterion.criteriaID, criterion, criterion.filename);
    return updatedCriterion;
  }));
  return updatedCriteria;
  }
  
  async deleteCriterion(id: number): Promise<void> {
    let criterion = await this.criterionRepository.findOne({
      where: {criteriaID: id}
    });
    if (!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }
    await this.criterionRepository.remove(criterion);
  }
}