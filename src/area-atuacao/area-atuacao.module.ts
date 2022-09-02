import { Module } from '@nestjs/common';
import { AreaAtuacaoService } from './area-atuacao.service';
import { AreaAtuacaoController } from './area-atuacao.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AreaAtuacaoController],
  providers: [AreaAtuacaoService],
})
export class AreaAtuacaoModule {}
