/**
 *  CRIADO EM: 05/09/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a intervencoes
 */

import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { IntervencoesService } from './intervencoes.service';
import { CreateIntervencaoDto } from './dto/create-intervencao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('intervencoes')
export class IntervencoesController {
  constructor(private readonly intervencoesService: IntervencoesService) {}

  @Post()
  create(@Body() createIntervencoeDto: CreateIntervencaoDto) {
    return this.intervencoesService.create(createIntervencoeDto);
  }

  @Get()
  findAll() {
    return this.intervencoesService.findAll();
  }
}
