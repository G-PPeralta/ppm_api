import { Test, TestingModule } from '@nestjs/testing';
import { PepController } from './pep.controller';
import { PepService } from './pep.service';

describe('PepController', () => {
  let controller: PepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PepController],
      providers: [PepService],
    }).compile();

    controller = module.get<PepController>(PepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
