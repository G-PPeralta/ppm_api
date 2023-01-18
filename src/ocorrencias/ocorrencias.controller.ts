/**
 *  CRIADO EM: 23/12/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a ocorrencias.
 */

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';

@UseGuards(JwtAuthGuard)
@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly service: OcorrenciasService) {}

  @Post(':id')
  create(@Body() payload: CreateOcorrenciaDto, @Param('id') id: string) {
    return this.service.create(payload, +id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
}
