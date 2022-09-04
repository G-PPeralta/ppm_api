import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencoesTipoController } from './intervencoes-tipo.controller';
import { IntervencoesTipoService } from './intervencoes-tipo.service';
import { IntervencaoTipoRepository } from './repository/intervencao-tipo.repository';

describe('IntervencoesTipoController', () => {
  let controller: IntervencoesTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntervencoesTipoController],
      providers: [IntervencoesTipoService, IntervencaoTipoRepository],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<IntervencoesTipoController>(
      IntervencoesTipoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
