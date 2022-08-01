import { Test, TestingModule } from '@nestjs/testing';
import { PrioridadeController } from './prioridade.controller';
import { PrioridadeService } from './prioridade.service';

describe('PrioridadeController', () => {
  let controller: PrioridadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrioridadeController],
      providers: [PrioridadeService],
    }).compile();

    controller = module.get<PrioridadeController>(PrioridadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
