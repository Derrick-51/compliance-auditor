import { Module } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CriteriaController } from './criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criterion } from './entities/criterion.entity';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [TypeOrmModule.forFeature([Criterion]), CampaignModule],
  controllers: [CriteriaController],
  providers: [CriteriaService],
  exports: [CriteriaService, TypeOrmModule],
})
export class CriteriaModule {}