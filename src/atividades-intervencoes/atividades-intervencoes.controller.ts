/**
 * CRIADO EM: 03/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a atividades de intervenção
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AtividadesIntervencoesService } from './atividades-intervencoes.service';

@UseGuards(JwtAuthGuard)
@Controller('atividades-intervencoes')
export class AtividadesIntervencoesController {
  constructor(
    private readonly atividadesIntervencoesService: AtividadesIntervencoesService,
  ) {}

  @Get()
  findAll() {
    return this.atividadesIntervencoesService.findAll();
  }
}
