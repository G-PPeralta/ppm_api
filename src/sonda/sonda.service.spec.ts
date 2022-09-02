import { Test, TestingModule } from '@nestjs/testing';
import { SondaService } from './sonda.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('SondaService', () => {
  let service: SondaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SondaService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<SondaService>(SondaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
