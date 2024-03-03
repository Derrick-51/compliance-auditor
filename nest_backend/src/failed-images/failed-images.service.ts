import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from 'src/image/entities/image.entity';

@Injectable()
export class FailedImagesService {
  constructor(
    @InjectRepository(Images)
    private failedImagesRepository: Repository<Images>,
  ) {}

  async getFailedImagesForAudit(auditId: number): Promise<Images[]> {
    return this.failedImagesRepository.find({ where: { audit: { id: auditId } } });
  }
}