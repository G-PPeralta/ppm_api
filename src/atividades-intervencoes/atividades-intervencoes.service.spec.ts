import { Test, TestingModule } from '@nestjs/testing';
import { ResponsavelModule } from '../responsavel/responsavel.module';
import { TarefaModule } from '../tarefa/tarefa.module';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';
import { AreaAtuacaoModule } from '../area-atuacao/area-atuacao.module';

describe('AtividadesIntervencoesService', () => {
  let service: AtividadesIntervencoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtividadesIntervencoesService,
        AtividadeIntervencaoRepository,
      ],
      imports: [
        PrismaModule,
        ResponsavelModule,
        TarefaModule,
        AreaAtuacaoModule,
      ],
    }).compile();

    service = module.get<AtividadesIntervencoesService>(
      AtividadesIntervencoesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
