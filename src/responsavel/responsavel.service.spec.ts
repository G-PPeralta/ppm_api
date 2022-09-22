import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ResponsavelService } from './responsavel.service';

describe('ResponsavelService', () => {
  let service: ResponsavelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsavelService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<ResponsavelService>(ResponsavelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
