import { Test, TestingModule } from '@nestjs/testing';
import { FiltrosController } from './filtros.controller';

describe('FiltrosController', () => {
  let controller: FiltrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiltrosController],
    }).compile();

    controller = module.get<FiltrosController>(FiltrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
