import { Test, TestingModule } from '@nestjs/testing';
import { LixeiraController } from './lixeira.controller';

describe('LixeiraController', () => {
  let controller: LixeiraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LixeiraController],
    }).compile();

    controller = module.get<LixeiraController>(LixeiraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
