import { Module } from '@nestjs/common';
import { ProjetoIntervencaoService } from './projeto-intervencao.service';
import { ProjetoIntervencaoController } from './projeto-intervencao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ProjetoIntervencaoRepository } from './repository/projeto-invervencoes.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetoIntervencaoController],
  providers: [ProjetoIntervencaoService, ProjetoIntervencaoRepository],
})
export class ProjetoIntervencaoModule {}
