import { Module } from '@nestjs/common';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';
import { AtividadesIntervencoesController } from './atividades-intervencoes.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ResponsavelModule } from '../responsavel/responsavel.module';
import { AtividadeIntervencaoRepository } from './repository/atividades-invervencoes.repository';
import { AreaAtuacaoModule } from '../area-atuacao/area-atuacao.module';

@Module({
  imports: [PrismaModule, ResponsavelModule, AreaAtuacaoModule],
  controllers: [AtividadesIntervencoesController],
  providers: [AtividadesIntervencoesService, AtividadeIntervencaoRepository],
  exports: [
    AtividadeIntervencaoRepository,
    AtividadeIntervencaoRepository,
    AtividadesIntervencoesService,
  ],
})
export class AtividadesIntervencoesModule {}
