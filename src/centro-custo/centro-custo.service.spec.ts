import { Test, TestingModule } from '@nestjs/testing';
import { CentroCustoService } from './centro-custo.service';

describe('CentroCustoService', () => {
  let service: CentroCustoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentroCustoService],
    }).compile();

    service = module.get<CentroCustoService>(CentroCustoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
