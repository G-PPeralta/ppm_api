import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { NovaOperacaoController } from './nova-operacao.controller';
import { NovaOperacaoService } from './nova-operacao.service';

@Module({
  imports: [PrismaModule],
  controllers: [NovaOperacaoController],
  providers: [NovaOperacaoService],
})
export class NovaOperacaoModule {}
