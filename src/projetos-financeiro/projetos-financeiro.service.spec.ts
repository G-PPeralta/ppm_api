import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

describe('ProjetosFinanceiroService', () => {
  let service: ProjetosFinanceiroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosFinanceiroService],
    }).compile();

    service = module.get<ProjetosFinanceiroService>(ProjetosFinanceiroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
