/**
 * CRIADO EM: 23/10/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados do dashboard
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('total-projetos')
  getTotalProjetosSGrafico() {
    return this.dashboardService.getTotalProjetosSGrafico();
  }

  @Get('total-projetos-mes')
  getTotalProjetosGraficoMes() {
    return this.dashboardService.getTotalProjetosGraficoMes();
  }

  @Get('prioridades-complexidades')
  getPrioridadeComplexidade() {
    return this.dashboardService.getPrioridadeComplexidade();
  }

  @Get('gates')
  getGates() {
    return this.dashboardService.getGates();
  }

  @Get('areas-demandadas')
  getAreasDemandadas() {
    return this.dashboardService.getAreasDemandadas();
  }

  @Get('solicitantes')
  getSolicitantes() {
    return this.dashboardService.getSolicitantes();
  }

  @Get('previsto-realizado-barras')
  async getPrevistoRealizadoBarras() {
    return await this.dashboardService.getPrevistoRealizadoBarras();
  }

  @Get('previstoBarras')
  async getTotalOrcamentoPrevisto() {
    return await this.dashboardService.getTotalOrcamentoPrevisto();
  }

  @Get('realizado')
  getTotalRealizado() {
    return this.dashboardService.getTotalRealizado();
  }

  @Get('nao-previsto')
  getTotalNaoPrevisto() {
    return this.dashboardService.getTotalNaoPrevisto();
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
