import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Criterion[]> {
    return await this.criteriaRepository.find();
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

  async delete(id: number) {
    const deletedCriterion = await this.criteriaRepository.findOne({
      where: {criteriaID: id},
      relations: {campaign: true}
    });

    if(!deletedCriterion) {
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    }

    await this.criteriaRepository.delete({criteriaID: id});
    
    return deletedCriterion;
  }
}