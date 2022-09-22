import { Module } from '@nestjs/common';
import { OperacaoIntervencaoService } from './operacao-intervencao.service';
import { OperacaoIntervencaoController } from './operacao-intervencao.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OperacaoIntervencaoService],
  controllers: [OperacaoIntervencaoController],
})
export class OperacaoIntervencaoModule {}
