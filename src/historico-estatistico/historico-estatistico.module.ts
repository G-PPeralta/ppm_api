import { Module } from '@nestjs/common';
import { HistoricoEstatisticoService } from './historico-estatistico.service';
import { HistoricoEstatisticoController } from './historico-estatistico.controller';
import { PrismaModule } from 'services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HistoricoEstatisticoService],
  controllers: [HistoricoEstatisticoController],
})
export class HistoricoEstatisticoModule {}
