import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from 'src/audit/entities/audit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LatestAuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  async getLatestAuditForDealership(dealershipId: number): Promise<Audit> {
    return this.auditRepository
      .createQueryBuilder('audit')
      .where('audit.userId = :dealershipId', { dealershipId })
      .orderBy('audit.auditDate', 'DESC')
      .getOne();
  }
}