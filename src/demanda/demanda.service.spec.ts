import { Test, TestingModule } from '@nestjs/testing';
import { DemandaService } from './demanda.service';

describe('DemandaService', () => {
  let service: DemandaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandaService],
    }).compile();

    service = module.get<DemandaService>(DemandaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
