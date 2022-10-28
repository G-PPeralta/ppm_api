import { Test, TestingModule } from '@nestjs/testing';
import { GraficosService } from './graficos.service';

describe('GraficosService', () => {
  let service: GraficosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraficosService],
    }).compile();

    service = module.get<GraficosService>(GraficosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
