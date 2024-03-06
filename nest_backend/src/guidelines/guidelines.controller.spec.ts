import { Test, TestingModule } from '@nestjs/testing';
import { GuidelinesController } from './guidelines.controller';

describe('GuidelinesController', () => {
  let controller: GuidelinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuidelinesController],
    }).compile();

    controller = module.get<GuidelinesController>(GuidelinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
