import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { PrioridadeService } from './prioridade.service';

describe('PrioridadeService', () => {
  let service: PrioridadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrioridadeService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<PrioridadeService>(PrioridadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
