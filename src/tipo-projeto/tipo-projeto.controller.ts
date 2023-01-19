/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE CRIAÇÃO E LISTAGEM DE TIPOS DE PROJETO (Ex: Estudo, Projeto)
 */

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TipoProjetoService } from './tipo-projeto.service';
import { CreateTipoProjetoDto } from './dto/create-tipo-projeto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tipo-projeto')
export class TipoProjetoController {
  constructor(private readonly tipoProjetoService: TipoProjetoService) {}

  @Post()
  create(@Body() createTipoProjetoDto: CreateTipoProjetoDto) {
    return this.tipoProjetoService.create(createTipoProjetoDto);
  }

  @Get()
  findAll() {
    return this.tipoProjetoService.findAll();
  }
}
