import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencoesTipoService } from './intervencoes-tipo.service';
import { IntervencaoTipoRepository } from './repository/intervencao-tipo.repository';

describe('IntervencoesTipoService', () => {
  let service: IntervencoesTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntervencoesTipoService, IntervencaoTipoRepository],
      imports: [PrismaModule],
    }).compile();

    service = module.get<IntervencoesTipoService>(IntervencoesTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
