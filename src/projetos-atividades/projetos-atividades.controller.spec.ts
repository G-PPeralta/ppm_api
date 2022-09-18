import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosAtividadesController } from './projetos-atividades.controller';

describe('ProjetosAtividadesController', () => {
  let controller: ProjetosAtividadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosAtividadesController],
    }).compile();

    controller = module.get<ProjetosAtividadesController>(
      ProjetosAtividadesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
