import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
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

@Controller('api/criteria')
export class CriteriaController {
  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly campaignService: CampaignService
    ) {}
  
    @Post('create')
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
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createCriteriaDto: CreateCriterionDto) {

            const filename: string = file.filename;

            const campaign: Campaign = await this.campaignService.findOneWithCriteria(createCriteriaDto.campaignID)

            const criterion = await this.criteriaService.create(createCriteriaDto, filename, campaign);

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
  update(@Param('id') id: string, @Body() updateCriterionDto: UpdateCriterionDto) {
    return this.criteriaService.update(+id, updateCriterionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaService.remove(+id);
  }
}
