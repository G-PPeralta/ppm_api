import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencoesService } from './intervencoes.service';

describe('IntervencoesService', () => {
  let service: IntervencoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntervencoesService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<IntervencoesService>(IntervencoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
