/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados de areas para atuação de projetos
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AreaAtuacaoService } from './area-atuacao.service';

@UseGuards(JwtAuthGuard)
@Controller('area-atuacao')
export class AreaAtuacaoController {
  constructor(private readonly areaAtuacaoService: AreaAtuacaoService) {}

  @Get()
  findAll() {
    return this.areaAtuacaoService.findAll();
  }

  @Get('/tipo/:tipo')
  findByAreaSistema(@Param('tipo') tipo: string) {
    return this.areaAtuacaoService.findByTipo(tipo);
  }
}
