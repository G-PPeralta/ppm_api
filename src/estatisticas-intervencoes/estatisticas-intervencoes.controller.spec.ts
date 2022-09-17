import { Test, TestingModule } from '@nestjs/testing';
import { EstatisticasIntervencoesController } from './estatisticas-intervencoes.controller';

describe('EstatisticasIntervencoesController', () => {
  let controller: EstatisticasIntervencoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstatisticasIntervencoesController],
    }).compile();

    controller = module.get<EstatisticasIntervencoesController>(
      EstatisticasIntervencoesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
