/**
 * CRIADO EM: 03/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a atividades de projeto
 */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AtividadesProjetosService } from './atividades-projetos.service';

@UseGuards(JwtAuthGuard)
@Controller('atividades-projetos')
export class AtividadesProjetosController {
  constructor(
    private readonly atividadesProjetosService: AtividadesProjetosService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesProjetosService.findOne(+id);
  }
}
