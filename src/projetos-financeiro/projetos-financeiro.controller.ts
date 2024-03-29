/**
 * CRIADO EM: 13/10/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: endpoints que listam projetos com suas respectivas informações financeiras (orçamento, total gasto, gap)
 */

import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

@UseGuards(JwtAuthGuard)
@Controller('projetos-financeiro')
export class ProjetosFinanceiroController {
  constructor(
    private readonly projetosFinanceiroService: ProjetosFinanceiroService,
  ) {}

  @Get('pai')
  findPais() {
    return this.projetosFinanceiroService.findPais();
  }

  @Get('filhos/:id/')
  findFilhos(@Param('id') id: string) {
    return this.projetosFinanceiroService.findFilhos(+id);
  }

  @Delete('delete/:id')
  async apagarFinanceirosPorPai(@Param('id') id: string) {
    return await this.projetosFinanceiroService.apagarFinanceirosPorPai(+id);
  }
}
