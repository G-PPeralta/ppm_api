import { Test, TestingModule } from '@nestjs/testing';
import { CampanhaProjetoTipoController } from './campanha-projeto-tipo.controller';

describe('CampanhaProjetoTipoController', () => {
  let controller: CampanhaProjetoTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampanhaProjetoTipoController],
    }).compile();

    controller = module.get<CampanhaProjetoTipoController>(
      CampanhaProjetoTipoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
