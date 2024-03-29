import { Module } from '@nestjs/common';
import { AreaAtuacaoService } from './area-atuacao.service';
import { AreaAtuacaoController } from './area-atuacao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { AreaAtuacaoRepository } from './repository/area-atuacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AreaAtuacaoController],
  providers: [AreaAtuacaoService, AreaAtuacaoRepository],
  exports: [AreaAtuacaoRepository],
})
export class AreaAtuacaoModule {}
