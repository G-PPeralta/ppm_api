import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { DemandaService } from './demanda.service';

describe('DemandaService', () => {
  let service: DemandaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandaService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<DemandaService>(DemandaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
