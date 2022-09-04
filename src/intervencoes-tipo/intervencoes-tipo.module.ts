import { Module } from '@nestjs/common';
import { IntervencoesTipoService } from './intervencoes-tipo.service';
import { IntervencoesTipoController } from './intervencoes-tipo.controller';
import { IntervencaoTipoRepository } from './repository/intervencao-tipo.repository';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IntervencoesTipoController],
  providers: [IntervencoesTipoService, IntervencaoTipoRepository],
  exports: [IntervencaoTipoRepository],
})
export class IntervencoesTipoModule {}
