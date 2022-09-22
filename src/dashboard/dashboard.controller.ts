import {
  BadRequestException,
  Controller,
  Get,
  Query,
  // UseGuards,
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

// @UseGuards(JwtAuthGuard)
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
  getTotalOrcamentoPrevisto(@Query('polo_id_param') polo_id_param?: string) {
    if (polo_id_param && isNaN(Number(polo_id_param)))
      throw new BadRequestException(
        DashboardService.errors.totalOrcamento.badRequestError,
      );
    const numberPoloId = polo_id_param ? Number(polo_id_param) : null;
    return this.dashboardService.getTotalOrcamentoPrevisto(numberPoloId);
  }

  @Get('projetos-info')
  getInfoProjetos() {
    return this.dashboardService.getInfoProjetos();
  }

  @Get('projetos-info-alagoas')
  getInfoProjetosAlagoas() {
    return this.dashboardService.getInfoProjetosAlagoas();
  }

  @Get('projetos-info-tucano')
  getInfoProjetosTucanoSul() {
    return this.dashboardService.getInfoProjetosTucanoSul();
  }
}
