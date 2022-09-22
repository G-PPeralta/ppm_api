import { Test, TestingModule } from '@nestjs/testing';
import { PocoService } from './poco.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('PocoService', () => {
  let service: PocoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PocoService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<PocoService>(PocoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
