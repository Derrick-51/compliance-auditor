import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('api/campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return await this.campaignService.create(createCampaignDto);
  }

  @Get()
  async findAll() {
    return await this.campaignService.findAll();
  }

  @Get('latest')
  async findLatest() {
    return await this.campaignService.findLatest();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.campaignService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return await this.campaignService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.campaignService.delete(+id);
  }
}
