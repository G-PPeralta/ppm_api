import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { SolicitanteController } from './solicitante.controller';
import { SolicitanteService } from './solicitante.service';

describe('SolicitanteController', () => {
  let controller: SolicitanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitanteController],
      providers: [SolicitanteService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<SolicitanteController>(SolicitanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
