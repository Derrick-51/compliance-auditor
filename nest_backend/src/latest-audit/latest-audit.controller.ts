// latest-audit.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { LatestAuditService } from './latest-audit.service';
import { Audit } from 'src/audit/entities/audit.entity';


@Controller('latest-audit')
export class LatestAuditController {
  constructor(private readonly latestAuditService: LatestAuditService) {}

  @Get(':dealershipId')
  getLatestAuditForDealership(@Param('dealershipId') dealershipId: number): Promise<Audit> {
    return this.latestAuditService.getLatestAuditForDealership(dealershipId);
  }
}