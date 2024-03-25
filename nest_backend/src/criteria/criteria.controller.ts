import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpException, HttpStatus, Put, UploadedFiles, UploadedFile } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CampaignService } from '../campaign/campaign.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Campaign } from 'src/campaign/entities/campaign.entity';
import { UpdateAllCriterionDto } from './dto/update-all-criterion';

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

        return criterion;
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
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @Body() updateCriterionDto: UpdateCriterionDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    if (!Object.keys(updateCriterionDto).length) {
      throw new HttpException('Empty request body', HttpStatus.BAD_REQUEST);
    }

    return await this.criteriaService.update(+id, updateCriterionDto, files); // Pass files to service method
  }
    
  @Put('updateAll')
  @UseInterceptors(FilesInterceptor('files', 20))
  async updateAll(
    @Body() formData: any, // Parse FormData from the request body
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const criteria = formData.criteria; // Extract criteria array from FormData

    if (!criteria || !files || criteria.length !== files.length) {
      throw new HttpException('Invalid request data', HttpStatus.BAD_REQUEST);
    }

    const updatedCriteria = await this.criteriaService.updateAll(criteria, files);
    return updatedCriteria;
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const criterionId = parseInt(id);
      await this.criteriaService.deleteCriterion(criterionId);
      return { message: 'Criterion deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to delete criterion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}