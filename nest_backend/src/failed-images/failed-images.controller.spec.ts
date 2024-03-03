import { Test, TestingModule } from '@nestjs/testing';
import { FailedImagesController } from './failed-images.controller';

describe('FailedImagesController', () => {
  let controller: FailedImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FailedImagesController],
    }).compile();

    controller = module.get<FailedImagesController>(FailedImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
