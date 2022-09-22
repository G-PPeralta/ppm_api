import { Test, TestingModule } from '@nestjs/testing';
import { OperacaoIntervencaoService } from './operacao-intervencao.service';

describe('OperacaoIntervencaoService', () => {
  let service: OperacaoIntervencaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperacaoIntervencaoService],
    }).compile();

    service = module.get<OperacaoIntervencaoService>(
      OperacaoIntervencaoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
