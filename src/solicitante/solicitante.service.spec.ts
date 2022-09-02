import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { SolicitanteService } from './solicitante.service';

describe('SolicitanteService', () => {
  let service: SolicitanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitanteService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<SolicitanteService>(SolicitanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
