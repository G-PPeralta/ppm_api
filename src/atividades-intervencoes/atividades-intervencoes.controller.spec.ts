import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AtividadesIntervencoesController } from './atividades-intervencoes.controller';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';

describe('AtividadesIntervencoesController', () => {
  let controller: AtividadesIntervencoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadesIntervencoesController],
      providers: [AtividadesIntervencoesService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<AtividadesIntervencoesController>(
      AtividadesIntervencoesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
