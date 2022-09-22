import { Module } from '@nestjs/common';
import { SondaService } from './sonda.service';
import { SondaController } from './sonda.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { SondaRepository } from './repository/sonda-repository';
import { SondaExistsRule } from './validators/exists-sondas.validator';

@Module({
  imports: [PrismaModule],
  controllers: [SondaController],
  providers: [SondaService, SondaRepository, SondaExistsRule],
  exports: [SondaRepository, SondaExistsRule],
})
export class SondaModule {}
