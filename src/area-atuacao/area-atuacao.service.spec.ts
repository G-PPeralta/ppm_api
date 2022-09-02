import { Test, TestingModule } from '@nestjs/testing';
import { AreaAtuacaoService } from './area-atuacao.service';
import { PrismaModule } from '../services/prisma/prisma.module';

describe('AreaAtuacaoService', () => {
  let service: AreaAtuacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaAtuacaoService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<AreaAtuacaoService>(AreaAtuacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
