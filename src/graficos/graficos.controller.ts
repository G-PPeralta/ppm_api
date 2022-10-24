import { Controller, Get, Param } from '@nestjs/common';
import { GraficosService } from './graficos.service';
@Controller('graficos')
export class GraficosController {
  constructor(private readonly graficosService: GraficosService) {}
  @Get('historico/:de/:a')
  getHistorico(@Param('de') de: string, @Param('a') a: string) {
    return this.graficosService.getHistorico(de, a);
  }
  @Get('intervencao')
  getIntervencao() {
    return this.graficosService.getIntervencao();
  }
  @Get('intervencao')
  getNPT() {
    return this.graficosService.getIntervencao();
  }
}
