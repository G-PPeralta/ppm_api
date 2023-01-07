import { Test, TestingModule } from '@nestjs/testing';
import { PriorizacoesController } from './priorizacoes.controller';

describe('PriorizacoesController', () => {
  let controller: PriorizacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriorizacoesController],
    }).compile();

    controller = module.get<PriorizacoesController>(PriorizacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
