import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { UserModule } from 'src/user/user.module';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [TypeOrmModule.forFeature([Audit]), UserModule, CampaignModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService, TypeOrmModule]
})
export class AuditModule {}
