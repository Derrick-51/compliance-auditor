// failed-images.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { Images } from 'src/image/entities/image.entity';
import { FailedImagesService } from './failed-images.service';


@Controller('failed-images')
export class FailedImagesController {
  constructor(private readonly failedImagesService: FailedImagesService) {}

  @Get(':auditId')
  getFailedImagesForAudit(@Param('auditId') auditId: number): Promise<Images[]> {
    return this.failedImagesService.getFailedImagesForAudit(auditId);
  }
}