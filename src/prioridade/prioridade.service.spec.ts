import { Test, TestingModule } from '@nestjs/testing';
import { PrioridadeService } from './prioridade.service';

describe('PrioridadeService', () => {
  let service: PrioridadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrioridadeService],
    }).compile();

    service = module.get<PrioridadeService>(PrioridadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
