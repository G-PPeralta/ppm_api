import { Test, TestingModule } from '@nestjs/testing';
import { AreaAtuacaoController } from './area-atuacao.controller';
import { AreaAtuacaoService } from './area-atuacao.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('AreaAtuacaoController', () => {
  let controller: AreaAtuacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaAtuacaoController],
      providers: [AreaAtuacaoService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<AreaAtuacaoController>(AreaAtuacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
