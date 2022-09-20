import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesNotasController } from './atividades-notas.controller';

describe('AtividadesNotasController', () => {
  let controller: AtividadesNotasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadesNotasController],
    }).compile();

    controller = module.get<AtividadesNotasController>(
      AtividadesNotasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
