import { Module } from '@nestjs/common';
import { IntervencoesService } from './intervencoes.service';
import { IntervencoesController } from './intervencoes.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencaoRepository } from './repositories/intervencoes.repository';
import { PocoModule } from '../poco/poco.module';
import { SondaModule } from '../sonda/sonda.module';

@Module({
  controllers: [IntervencoesController],
  providers: [IntervencoesService, IntervencaoRepository],
  imports: [PrismaModule, PocoModule, SondaModule],
  exports: [IntervencaoRepository],
})
export class IntervencoesModule {}
