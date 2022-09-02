import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AtividadeCampanhaService } from './atividade-campanha.service';

describe('AtividadeCampanhaService', () => {
  let service: AtividadeCampanhaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadeCampanhaService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<AtividadeCampanhaService>(AtividadeCampanhaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
