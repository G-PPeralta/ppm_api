import { Test, TestingModule } from '@nestjs/testing';
import { SondaController } from './sonda.controller';
import { SondaService } from './sonda.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('SondaController', () => {
  let controller: SondaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SondaController],
      providers: [SondaService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<SondaController>(SondaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
