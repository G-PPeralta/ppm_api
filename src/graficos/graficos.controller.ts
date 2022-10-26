import { Controller, Get, Query } from '@nestjs/common';
import { GraficosService } from './graficos.service';
@Controller('graficos')
export class GraficosController {
  constructor(private readonly graficosService: GraficosService) {}

  @Get('total')
  getHistoricoTotal() {
    return this.graficosService.getHistoricoTotal();
  }
  @Get('historico')
  getRelatorioHistoricoPorPoco(@Query() params?: string[]) {
    return this.graficosService.getRelatorioHistoricoPorPoco(params);
  }
  @Get('intervencao')
  getRelatorioPorCadaIntervencao() {
    return this.graficosService.getRelatorioPorCadaIntervencao();
  }
  @Get('tempo')
  getRelatorioTempoNPTPorSonda() {
    return this.graficosService.getRelatorioTempoNPTPorSonda();
  }
  @Get('sonda')
  getRelatorioPorCadaSonda() {
    return this.graficosService.getRelatorioPorCadaSonda();
  }
  @Get('cpi')
  getRelatorioParaCPI() {
    return this.graficosService.getRelatorioParaCPI();
  }
}
