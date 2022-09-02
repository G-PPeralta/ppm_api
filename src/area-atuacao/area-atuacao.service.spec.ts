import { Test, TestingModule } from '@nestjs/testing';
import { AreaAtuacaoService } from './area-atuacao.service';
import { PrismaModule } from '../services/prisma/prisma.module';
import { TarefaModule } from '../tarefa/tarefa.module';
import { ResponsavelModule } from '../responsavel/responsavel.module';
import { AreaAtuacaoRepository } from './repository/area-atuacao.repository';

describe('AreaAtuacaoService', () => {
  let service: AreaAtuacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaAtuacaoService, AreaAtuacaoRepository],
      imports: [PrismaModule, TarefaModule, ResponsavelModule],
    }).compile();

    service = module.get<AreaAtuacaoService>(AreaAtuacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
