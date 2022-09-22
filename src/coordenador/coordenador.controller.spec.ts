import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { CoordenadorController } from './coordenador.controller';
import { CoordenadorService } from './coordenador.service';

describe('CoordenadorController', () => {
  let controller: CoordenadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordenadorController],
      providers: [CoordenadorService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<CoordenadorController>(CoordenadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
