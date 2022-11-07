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
  getRelatorioPorCadaIntervencao(@Query() params?: string[]) {
    return this.graficosService.getRelatorioPorCadaIntervencao(params);
  }
  @Get('tempo')
  getRelatorioTempoNPTPorSonda(@Query() params?: string[]) {
    return this.graficosService.getRelatorioTempoNPTPorSonda(params);
  }
  @Get('sonda')
  getRelatorioPorCadaSonda(@Query() params?: string[]) {
    return this.graficosService.getRelatorioPorCadaSonda(params);
  }
  @Get('cpi')
  getRelatorioParaCPI(@Query() params?: string[]) {
    return this.graficosService.getRelatorioParaCPI(params);
  }
}
