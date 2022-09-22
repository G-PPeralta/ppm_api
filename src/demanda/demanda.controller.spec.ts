import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { DemandaController } from './demanda.controller';
import { DemandaService } from './demanda.service';

describe('DemandaController', () => {
  let controller: DemandaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandaController],
      providers: [DemandaService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<DemandaController>(DemandaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
