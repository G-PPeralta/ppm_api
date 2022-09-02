import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { DivisaoService } from './divisao.service';

describe('DivisaoService', () => {
  let service: DivisaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisaoService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<DivisaoService>(DivisaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
