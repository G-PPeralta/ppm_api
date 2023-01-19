/**
 * CRIADO EM: 27/07/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE CRIAÇÃO E LISTAGEM DE SOLICITANTES DE UM PROJETO.
 * DIZ RESPEITO A QUAL ÁREA DA ORIGEM ESTÁ SOLICITANDO UM PROJETO QUE ESTÁ SENDO CADASTRADO
 */

import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SolicitanteService } from './solicitante.service';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('solicitante')
export class SolicitanteController {
  constructor(private readonly solicitanteService: SolicitanteService) {}

  @Post()
  create(@Body() createSolicitanteDto: CreateSolicitanteDto) {
    return this.solicitanteService.create(createSolicitanteDto);
  }

  @Get()
  findAll() {
    try {
      return this.solicitanteService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}
