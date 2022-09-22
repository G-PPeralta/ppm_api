import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ProjetosService } from './projetos.service';

describe('ProjetosService', () => {
  let service: ProjetosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetosService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<ProjetosService>(ProjetosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
