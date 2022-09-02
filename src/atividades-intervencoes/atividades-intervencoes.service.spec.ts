import { Test, TestingModule } from '@nestjs/testing';
import { ResponsavelModule } from 'responsavel/responsavel.module';
import { TarefaModule } from 'tarefa/tarefa.module';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';

describe('AtividadesIntervencoesService', () => {
  let service: AtividadesIntervencoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadesIntervencoesService],
      imports: [PrismaModule, ResponsavelModule, TarefaModule],
    }).compile();

    service = module.get<AtividadesIntervencoesService>(
      AtividadesIntervencoesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
