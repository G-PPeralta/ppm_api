import { Test, TestingModule } from '@nestjs/testing';
import { FiltrosService } from './filtros.service';

describe('FiltrosService', () => {
  let service: FiltrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiltrosService],
    }).compile();

    service = module.get<FiltrosService>(FiltrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
