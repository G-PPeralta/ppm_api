import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { PrioridadeController } from './prioridade.controller';
import { PrioridadeService } from './prioridade.service';

describe('PrioridadeController', () => {
  let controller: PrioridadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrioridadeController],
      providers: [PrioridadeService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<PrioridadeController>(PrioridadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
