import { Test, TestingModule } from '@nestjs/testing';
import { LatestAuditController } from './latest-audit.controller';

describe('LatestAuditController', () => {
  let controller: LatestAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LatestAuditController],
    }).compile();

    controller = module.get<LatestAuditController>(LatestAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
