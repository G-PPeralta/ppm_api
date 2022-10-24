import { Controller, Get, Param } from '@nestjs/common';
import { GraficosService } from './graficos.service';
@Controller('graficos')
export class GraficosController {
  constructor(private readonly graficosService: GraficosService) {}
  @Get(['historico/:de/:a', 'historico'])
  getRelatorioHistorico(@Param('de') de?: string, @Param('a') a?: string) {
    if (de && a) return this.graficosService.getRelatorioHistorico(de, a);
    else return this.graficosService.getRelatorioHistorico();
  }
  @Get('intervencao')
  getRelatorioPorCadaIntervencao() {
    return this.graficosService.getRelatorioPorCadaIntervencao();
  }
  @Get('tempo')
  getRelatorioTempoNPTPorSonda() {
    return this.graficosService.getRelatorioTempoNPTPorSonda();
  }
}
