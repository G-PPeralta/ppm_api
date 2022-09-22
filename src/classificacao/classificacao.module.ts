import { Module } from '@nestjs/common';
import { ClassificacaoService } from './classificacao.service';
import { ClassificacaoController } from './classificacao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassificacaoController],
  providers: [ClassificacaoService],
})
export class ClassificacaoModule {}
