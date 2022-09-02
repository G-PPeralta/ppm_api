import { Module } from '@nestjs/common';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';
import { AtividadesIntervencoesController } from './atividades-intervencoes.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ResponsavelModule } from '../responsavel/responsavel.module';
import { TarefaModule } from '../tarefa/tarefa.module';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';

@Module({
  imports: [PrismaModule, ResponsavelModule, TarefaModule],
  controllers: [AtividadesIntervencoesController],
  providers: [AtividadesIntervencoesService, AtividadeIntervencaoRepository],
  exports: [AtividadeIntervencaoRepository, AtividadeIntervencaoRepository],
})
export class AtividadesIntervencoesModule {}
