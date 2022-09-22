import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { CoordenadorService } from './coordenador.service';

describe('CoordenadorService', () => {
  let service: CoordenadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoordenadorService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<CoordenadorService>(CoordenadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
