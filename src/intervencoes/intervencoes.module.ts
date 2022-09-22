import { Module } from '@nestjs/common';
import { IntervencoesService } from './intervencoes.service';
import { IntervencoesController } from './intervencoes.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencaoRepository } from './repositories/intervencoes.repository';
import { PocoModule } from '../poco/poco.module';
import { SondaModule } from '../sonda/sonda.module';
import { ProjetoIntervencaoModule } from 'projeto-intervencao/projeto-intervencao.module';

@Module({
  controllers: [IntervencoesController],
  providers: [IntervencoesService, IntervencaoRepository],
  imports: [PrismaModule, PocoModule, SondaModule, ProjetoIntervencaoModule],
  exports: [IntervencaoRepository, IntervencoesService],
})
export class IntervencoesModule {}
