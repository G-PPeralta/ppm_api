import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoEstatisticoController } from './historico-estatistico.controller';

describe('HistoricoEstatisticoController', () => {
  let controller: HistoricoEstatisticoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricoEstatisticoController],
    }).compile();

    controller = module.get<HistoricoEstatisticoController>(
      HistoricoEstatisticoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
