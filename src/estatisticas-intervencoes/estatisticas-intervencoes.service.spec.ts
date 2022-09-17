import { Test, TestingModule } from '@nestjs/testing';
import { EstatisticasIntervencoesService } from './estatisticas-intervencoes.service';

describe('EstatisticasIntervencoesService', () => {
  let service: EstatisticasIntervencoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstatisticasIntervencoesService],
    }).compile();

    service = module.get<EstatisticasIntervencoesService>(
      EstatisticasIntervencoesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
