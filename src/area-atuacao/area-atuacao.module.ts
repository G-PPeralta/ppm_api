import { Module } from '@nestjs/common';
import { AreaAtuacaoService } from './area-atuacao.service';
import { AreaAtuacaoController } from './area-atuacao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AreaAtuacaoRepository } from './repository/area-atuacao.repository';
import { AreaAtuacaoExistsRule } from './validators/exists-area-atuacao.validator';

@Module({
  imports: [PrismaModule],
  controllers: [AreaAtuacaoController],
  providers: [AreaAtuacaoService, AreaAtuacaoExistsRule, AreaAtuacaoRepository],
  exports: [AreaAtuacaoExistsRule, AreaAtuacaoRepository],
})
export class AreaAtuacaoModule {}
