import { Test, TestingModule } from '@nestjs/testing';
import { ServicosSondaPocoService } from './servicos-sonda-poco.service';

describe('ServicosSondaPocoService', () => {
  let service: ServicosSondaPocoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicosSondaPocoService],
    }).compile();

    service = module.get<ServicosSondaPocoService>(ServicosSondaPocoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
