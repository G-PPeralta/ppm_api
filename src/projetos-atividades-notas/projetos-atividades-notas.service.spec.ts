import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesNotasService } from './projetos-atividades-notas.service';

describe('ProjetosAtividadesNotasService', () => {
  let service: ProjetosAtividadesNotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosAtividadesNotasService],
    }).compile();

    service = module.get<ProjetosAtividadesNotasService>(
      ProjetosAtividadesNotasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
