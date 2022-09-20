import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesLicoesAprendidasService } from './projetos-atividades-licoes-aprendidas.service';

describe('ProjetosAtividadesLicoesAprendidasService', () => {
  let service: ProjetosAtividadesLicoesAprendidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosAtividadesLicoesAprendidasService],
    }).compile();

    service = module.get<ProjetosAtividadesLicoesAprendidasService>(
      ProjetosAtividadesLicoesAprendidasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
