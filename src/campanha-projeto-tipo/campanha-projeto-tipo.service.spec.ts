import { Test, TestingModule } from '@nestjs/testing';
import { CampanhaProjetoTipoService } from './campanha-projeto-tipo.service';

describe('CampanhaProjetoTipoService', () => {
  let service: CampanhaProjetoTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampanhaProjetoTipoService],
    }).compile();

    service = module.get<CampanhaProjetoTipoService>(
      CampanhaProjetoTipoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
