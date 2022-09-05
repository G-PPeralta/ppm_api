import { Module } from '@nestjs/common';
import { IntervencoesTipoService } from './intervencoes-tipo.service';
import { IntervencoesTipoController } from './intervencoes-tipo.controller';
import { IntervencaoTipoRepository } from './repository/intervencao-tipo.repository';
import { PrismaModule } from '../services/prisma/prisma.module';
import { IntervencaoTipoExistsRule } from './validators/exists-intervencoes-tipo.validator';

@Module({
  imports: [PrismaModule],
  controllers: [IntervencoesTipoController],
  providers: [
    IntervencoesTipoService,
    IntervencaoTipoRepository,
    IntervencaoTipoExistsRule,
  ],
  exports: [IntervencaoTipoRepository, IntervencaoTipoExistsRule],
})
export class IntervencoesTipoModule {}
