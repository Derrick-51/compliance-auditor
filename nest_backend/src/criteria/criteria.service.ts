import { HttpException, HttpStatus, Injectable, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { Criterion } from './entities/criterion.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { diskStorage, StorageEngine } from 'multer';
import { extname, join } from 'path';
import {v4 as uuidv4} from "uuid";
import { Request } from 'express';
import { writeFileSync } from 'fs';


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

  async update(id: number, updateCriterionDto: UpdateCriterionDto, @UploadedFiles() files: Array<Express.Multer.File>): Promise<Criterion> {    let criterion = await this.criterionRepository.findOne({
      where: { criteriaID: id },
    });
    if (!criterion) {
      throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
    }
  
    // Update the criterion properties
    Object.assign(criterion, updateCriterionDto);
  
    if (files && files.length > 0) {
      for (const file of files) {
        // Save each file to the "posters" folder
        const savedFilename = await this.saveFile(file);
        // Update the filename property in the criterion
        criterion.filename = savedFilename;
      }
    }
  
    // Save the updated criterion to the database
    await criterion.save();
  
    return criterion;
  }
  
  async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueName = uuidv4();
    const extension = extname(file.originalname);
    const filename = `${uniqueName}${extension}`;
    const filePath = join('posters', filename);

    try {
      writeFileSync(filePath, file.buffer);
      return filename;
    } catch (error) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAll(criteria: UpdateCriterionDto[], files: any[]): Promise<Criterion[]> {
    const updatedCriteria = await Promise.all(criteria.map(async (criterion, index) => {
      const updatedCriterion = await this.update(criterion.criteriaID, criterion, files[index]);
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