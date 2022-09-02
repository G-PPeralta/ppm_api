import { Test, TestingModule } from '@nestjs/testing';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('TarefaController', () => {
  let controller: TarefaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarefaController],
      providers: [TarefaService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<TarefaController>(TarefaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
