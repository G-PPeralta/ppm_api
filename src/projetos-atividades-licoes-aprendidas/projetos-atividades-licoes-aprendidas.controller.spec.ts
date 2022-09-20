import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesLicoesAprendidasController } from './projetos-atividades-licoes-aprendidas.controller';

describe('ProjetosAtividadesLicoesAprendidasController', () => {
  let controller: ProjetosAtividadesLicoesAprendidasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosAtividadesLicoesAprendidasController],
    }).compile();

    controller = module.get<ProjetosAtividadesLicoesAprendidasController>(
      ProjetosAtividadesLicoesAprendidasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
