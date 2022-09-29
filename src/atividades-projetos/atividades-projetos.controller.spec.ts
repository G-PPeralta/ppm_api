import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesProjetosController } from './atividades-projetos.controller';
import { AtividadesProjetosService } from './atividades-projetos.service';

describe('AtividadesProjetosController', () => {
  let controller: AtividadesProjetosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadesProjetosController],
      providers: [AtividadesProjetosService],
    }).compile();

    controller = module.get<AtividadesProjetosController>(
      AtividadesProjetosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
