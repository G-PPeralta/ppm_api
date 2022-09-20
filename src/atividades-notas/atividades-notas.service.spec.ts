import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesNotasService } from './atividades-notas.service';

describe('AtividadesNotasService', () => {
  let service: AtividadesNotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadesNotasService],
    }).compile();

    service = module.get<AtividadesNotasService>(AtividadesNotasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
