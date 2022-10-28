import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesProjetosService } from './atividades-projetos.service';

describe('AtividadesProjetosService', () => {
  let service: AtividadesProjetosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadesProjetosService],
    }).compile();

    service = module.get<AtividadesProjetosService>(AtividadesProjetosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
