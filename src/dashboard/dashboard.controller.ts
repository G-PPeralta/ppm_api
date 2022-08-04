import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('total-projetos')
  getTotalProjetosSGrafico() {
    return this.dashboardService.getTotalProjetosSGrafico();
  }

  @Get('areas-demandadas')
  getAreasDemandadas() {
    return this.dashboardService.getAreasDemandadas();
  }

  @Get('orcamento-total')
  getTotalOrcamentoPrevisto() {
    return this.dashboardService.getTotalOrcamentoPrevisto();
  }
}
