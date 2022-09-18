import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesRecursosService } from './atividades-recursos.service';

describe('AtividadesRecursosService', () => {
  let service: AtividadesRecursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadesRecursosService],
    }).compile();

    service = module.get<AtividadesRecursosService>(AtividadesRecursosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
