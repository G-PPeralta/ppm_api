import { Controller, Get, Param, Query } from '@nestjs/common';
import { GraficosService } from './graficos.service';
@Controller('graficos')
export class GraficosController {
  constructor(private readonly graficosService: GraficosService) {}
  @Get(['historico/:de/:a', 'historico'])
  getRelatorioHistorico(@Query() params?: string[]) {
    return this.graficosService.getRelatorioHistorico(params);
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
