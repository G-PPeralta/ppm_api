import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { PoloService } from './polo.service';

describe('PoloService', () => {
  let service: PoloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoloService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<PoloService>(PoloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
