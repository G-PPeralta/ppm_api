import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoEstatisticoService } from './historico-estatistico.service';

describe('HistoricoEstatisticoService', () => {
  let service: HistoricoEstatisticoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricoEstatisticoService],
    }).compile();

    service = module.get<HistoricoEstatisticoService>(
      HistoricoEstatisticoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
