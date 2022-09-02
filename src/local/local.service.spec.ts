import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { LocalService } from './local.service';

describe('LocalService', () => {
  let service: LocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<LocalService>(LocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
