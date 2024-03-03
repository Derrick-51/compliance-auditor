import { Test, TestingModule } from '@nestjs/testing';
import { LatestAuditService } from './latest-audit.service';

describe('LatestAuditService', () => {
  let service: LatestAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LatestAuditService],
    }).compile();

    service = module.get<LatestAuditService>(LatestAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
