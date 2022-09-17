import { Module } from '@nestjs/common';
import { AtividadesIntervencoesModule } from 'atividades-intervencoes/atividades-intervencoes.module';
import { IntervencoesModule } from 'intervencoes/intervencoes.module';
import { EstatisticasIntervencoesController } from './estatisticas-intervencoes.controller';
import { EstatisticasIntervencoesService } from './estatisticas-intervencoes.service';

@Module({
  imports: [AtividadesIntervencoesModule, IntervencoesModule],
  controllers: [EstatisticasIntervencoesController],
  providers: [EstatisticasIntervencoesService],
})
export class EstatisticasIntervencoesModule {}
