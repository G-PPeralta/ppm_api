/**
 * CRIADO EM: 20/11/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a dados de responsaveis de projetos
 */

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { AreaResponsavelService } from './area_responsavel.service';
import { CreateAreaResponsavel } from './dto/create-responsavel.dto';

@Controller('area-responsavel')
export class AreaResponsavelController {
  constructor(private service: AreaResponsavelService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Post()
  async create(@Body() area: CreateAreaResponsavel) {
    return await this.service.createArea(area);
  }
}
