import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesRecursosController } from './atividades-recursos.controller';

describe('AtividadesRecursosController', () => {
  let controller: AtividadesRecursosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadesRecursosController],
    }).compile();

    controller = module.get<AtividadesRecursosController>(
      AtividadesRecursosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
