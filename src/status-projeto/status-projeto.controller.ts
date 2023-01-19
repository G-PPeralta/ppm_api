/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE CRIAÇÃO E LISTAGEM DE STATUS DE UM PROJETO.
 * O STATUS DE UM PROJETO É INFORMADO NA TELA DE CADASTRO DE UM PROJETO
 * ESSAS ROTAS SÃO USADAS PARA ABASTECER AS OPTIONS DE UM SELECT, QUE FARÁ PARTE
 * DO PAYLOAD DO CADASTRO DE UM PROJETO
 */

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StatusProjetoService } from './status-projeto.service';
import { CreateStatusProjetoDto } from './dto/create-status-projeto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('status-projeto')
export class StatusProjetoController {
  constructor(private readonly statusProjetoService: StatusProjetoService) {}

  @Post()
  create(@Body() createStatusProjetoDto: CreateStatusProjetoDto) {
    return this.statusProjetoService.create(createStatusProjetoDto);
  }

  @Get()
  findAll() {
    return this.statusProjetoService.findAll();
  }
}
