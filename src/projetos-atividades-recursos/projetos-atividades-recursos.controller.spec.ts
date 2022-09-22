import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesRecursosController } from './projetos-atividades-recursos.controller';

describe('ProjetosAtividadesRecursosController', () => {
  let controller: ProjetosAtividadesRecursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosAtividadesRecursosController],
    }).compile();

    controller = module.get<ProjetosAtividadesRecursosController>(
      ProjetosAtividadesRecursosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
