import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ClassificacaoController } from './classificacao.controller';
import { ClassificacaoService } from './classificacao.service';

describe('ClassificacaoController', () => {
  let controller: ClassificacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassificacaoController],
      providers: [ClassificacaoService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<ClassificacaoController>(ClassificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
