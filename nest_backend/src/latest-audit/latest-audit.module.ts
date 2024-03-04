import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestAuditController } from './latest-audit.controller';
import { LatestAuditService } from './latest-audit.service';
import { Audit } from 'src/audit/entities/audit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Audit]),
  ],
  controllers: [LatestAuditController],
  providers: [LatestAuditService],
})
export class LatestAuditModule {}