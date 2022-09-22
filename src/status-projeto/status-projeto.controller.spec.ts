import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { StatusProjetoController } from './status-projeto.controller';
import { StatusProjetoService } from './status-projeto.service';

describe('StatusProjetoController', () => {
  let controller: StatusProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusProjetoController],
      providers: [StatusProjetoService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<StatusProjetoController>(StatusProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
