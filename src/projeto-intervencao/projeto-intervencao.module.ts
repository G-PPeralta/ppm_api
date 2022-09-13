import { Module } from '@nestjs/common';
import { ProjetoIntervencaoService } from './projeto-intervencao.service';
import { ProjetoIntervencaoController } from './projeto-intervencao.controller';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetoIntervencaoController],
  providers: [ProjetoIntervencaoService],
})
export class ProjetoIntervencaoModule {}
