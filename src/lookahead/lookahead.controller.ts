/**
 *  CRIADO EM: 23/12/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a lookhead.
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { LookaheadService } from './lookahead.service';

@UseGuards(JwtAuthGuard)
@Controller('lookahead')
export class LookaheadController {
  constructor(private readonly lookaheadService: LookaheadService) {}

  @Get('projetos')
  async GetProjetos() {
    return await this.lookaheadService.projetosComAtividades();
  }

  @Get('/atividades/:id')
  async GetAtividades(@Param('id') id: string) {
    return await this.lookaheadService.atividadesPorProjeto(id);
  }

  @Get('/atividade/:id')
  async GetAtividade(@Param('id') id: string) {
    return await this.lookaheadService.atividade(id);
  }

  @Get('/ferramentas-servicos/:id')
  async GetFerramentasServicos(@Param('id') id: string) {
    return await this.lookaheadService.getFerramentaServico(id);
  }

  @Get('/atividades-filho/:id')
  async GetAtividadesFilho(@Param('id') id: string) {
    return await this.lookaheadService.atividadesFilho(id);
  }
}
