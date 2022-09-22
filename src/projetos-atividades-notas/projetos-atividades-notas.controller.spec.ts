import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesNotasController } from './projetos-atividades-notas.controller';

describe('ProjetosAtividadesNotasController', () => {
  let controller: ProjetosAtividadesNotasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosAtividadesNotasController],
    }).compile();

    controller = module.get<ProjetosAtividadesNotasController>(
      ProjetosAtividadesNotasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
