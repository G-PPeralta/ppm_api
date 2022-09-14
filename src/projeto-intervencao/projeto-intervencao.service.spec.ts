import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoIntervencaoService } from './projeto-intervencao.service';

describe('ProjetoIntervencaoService', () => {
  let service: ProjetoIntervencaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetoIntervencaoService],
    }).compile();

    service = module.get<ProjetoIntervencaoService>(ProjetoIntervencaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
