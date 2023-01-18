/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Endpoints de criação e listagem de responsáveis de um projeto.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}

  @Post()
  async create(@Body() createResponsavelDto: CreateResponsavelDto) {
    const responsavel = await this.responsavelService.create(
      createResponsavelDto,
    );

    return responsavel;
  }

  @Get()
  async findAll() {
    try {
      return this.responsavelService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('projetos/:tipo')
  async findAllProjetos(@Param('tipo') tipo: string) {
    try {
      return this.responsavelService.findAllProjetos(tipo);
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
