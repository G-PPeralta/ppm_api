/**
 * CRIADO EM: 14/08/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado a coordenadores
 */
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoordenadorService } from './coordenador.service';
import { CreateCoordenadorDto } from './dto/create-coordenador.dto';

@UseGuards(JwtAuthGuard)
@Controller('coordenador')
export class CoordenadorController {
  constructor(private readonly coordenadorService: CoordenadorService) {}

  @Post()
  async create(@Body() createCoordenadorDto: CreateCoordenadorDto) {
    const coordenadorAlreadyExists = await this.coordenadorService.findByName(
      createCoordenadorDto.coordenadorNome,
    );
    const coordenador = this.coordenadorService.create(createCoordenadorDto);

    return coordenador;
  }

  @Get()
  findAll() {
    return this.coordenadorService.findAll();
  }
}
