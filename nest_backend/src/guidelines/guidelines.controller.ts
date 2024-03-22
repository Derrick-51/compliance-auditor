import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { GuidelinesService } from './guidelines.service';

@Controller('api/guidelines')
export class GuidelinesController {
  constructor(private readonly guidelinesService: GuidelinesService) {}

  @Get()
  getCriteria(): any[] {
    return this.guidelinesService.getCriteria();
  }

  @Put(':id')
  updateCriterion(@Param('id') id: number, @Body() criterion: any): any {
    return this.guidelinesService.updateCriterion(id, criterion);
  }

  @Put()
  updateAllCriteria(@Body() criteria: any[]): any {
    return this.guidelinesService.updateAllCriteria(criteria);
  }
}