import { Test, TestingModule } from '@nestjs/testing';
import { FailedImagesService } from './failed-images.service';

describe('FailedImagesService', () => {
  let service: FailedImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FailedImagesService],
    }).compile();

    service = module.get<FailedImagesService>(FailedImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
