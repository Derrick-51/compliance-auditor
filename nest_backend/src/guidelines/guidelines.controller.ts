import { Controller, Post, Body } from '@nestjs/common';
import { GuidelinesService } from './guidelines.service';

@Controller('api')
export class GuidelinesController {
  constructor(private readonly guidelinesService: GuidelinesService) {}

  @Post('save-guidelines')
  saveGuidelines(@Body() guidelines: string): void {
    this.guidelinesService.saveGuidelines(guidelines);
  }
}