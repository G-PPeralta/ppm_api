import { Test, TestingModule } from '@nestjs/testing';
import { NovaOperacaoService } from './nova-operacao.service';

describe('NovaOperacaoService', () => {
  let service: NovaOperacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NovaOperacaoService],
    }).compile();

    service = module.get<NovaOperacaoService>(NovaOperacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
