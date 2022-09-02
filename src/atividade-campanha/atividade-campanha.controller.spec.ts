import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AtividadeCampanhaController } from './atividade-campanha.controller';
import { AtividadeCampanhaModule } from './atividade-campanha.module';
import { AtividadeCampanhaService } from './atividade-campanha.service';

describe('AtividadeCampanhaController', () => {
  let controller: AtividadeCampanhaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtividadeCampanhaController],
      providers: [AtividadeCampanhaService],
      imports: [AtividadeCampanhaModule, PrismaModule],
    }).compile();

    controller = module.get<AtividadeCampanhaController>(
      AtividadeCampanhaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
