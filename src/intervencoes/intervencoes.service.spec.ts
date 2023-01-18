import { Test, TestingModule } from '@nestjs/testing';
import { PocoModule } from '../poco/poco.module';
import { SondaModule } from '../sonda/sonda.module';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencoesService } from './intervencoes.service';
import { IntervencoesModule } from './intervencoes.module';

describe('IntervencoesService', () => {
  let service: IntervencoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntervencoesService],
      imports: [PrismaModule, SondaModule, PocoModule, IntervencoesModule],
    }).compile();

    service = module.get<IntervencoesService>(IntervencoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
