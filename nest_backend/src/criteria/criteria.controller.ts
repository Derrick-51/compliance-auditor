import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CampaignService } from '../campaign/campaign.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';
import { Request } from 'express'
import { diskStorage } from 'multer';
import { extname } from 'path';
import {v4 as uuidv4} from "uuid";
import { Campaign } from 'src/campaign/entities/campaign.entity';
import { isEmpty, validate } from 'class-validator';

@Controller('api/criteria')
export class CriteriaController {
  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly campaignService: CampaignService
    ) {}
  
    @Post('create')
    async create(@Body() createCriteriaDto: CreateCriterionDto) {
        // Criteria will attach to first campaign in database if no ID given
        if(!createCriteriaDto.campaignID) {
            throw new HttpException('No campaignID given', HttpStatus.BAD_REQUEST);
        }

        const campaign: Campaign = await this.campaignService.findOneWithCriteria(createCriteriaDto.campaignID)
        if(!campaign) {
            throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND)
        }

        const criterion = await this.criteriaService.create(campaign);

        return JSON.stringify(criterion)
    }

  @Get()
  findAll() {
    return this.criteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criteriaService.findOne(+id);
  }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: 'posters',
            filename: (req, file, callback) => {
                const uniqueName = uuidv4()
                const extension = extname(file.originalname)
                const filename = `${uniqueName}${extension}`

                callback(null, filename)
            }
        })
    }))
    async update(
        @Param('id') id: string,
        @Body() updateCriterionDto: UpdateCriterionDto,
        @UploadedFile() file: Express.Multer.File
        ) {
        // Check for empty body
        if(!Object.keys(updateCriterionDto).length) {
            throw new HttpException('Empty request body', HttpStatus.BAD_REQUEST);
        }

        let filename = "";
        if(file) {
            filename = file.filename;
        }

        const criterion = await this.criteriaService.findOne(+id);
        if(!criterion) {
          throw new HttpException('Criterion not found', HttpStatus.NOT_FOUND);
        }

        return await this.criteriaService.update(updateCriterionDto, filename, criterion);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaService.remove(+id);
  }
}
