import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencoesController } from './intervencoes.controller';
import { IntervencoesModule } from './intervencoes.module';
import { IntervencoesService } from './intervencoes.service';

describe('IntervencoesController', () => {
  let controller: IntervencoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntervencoesController],
      providers: [IntervencoesService],
      imports: [IntervencoesModule, PrismaModule],
    }).compile();

    controller = module.get<IntervencoesController>(IntervencoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
