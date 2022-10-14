import { Test, TestingModule } from '@nestjs/testing';
import { CentroCustoController } from './centro-custo.controller';

describe('CentroCustoController', () => {
  let controller: CentroCustoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CentroCustoController],
    }).compile();

    controller = module.get<CentroCustoController>(CentroCustoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
