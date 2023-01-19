/**
 * CRIADO EM: 25/09/2022
 * AUTOR: Pedro de França Lopes
 * DESCRIÇÃO DO ARQUIVO: Controlador relacionado ao template de projetos
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CampanhaProjetoTipoService } from './campanha-projeto-tipo.service';
import { CreateCampanhaProjetoTipo } from './dto/create-campanha-projeto-tipo.dto';

@UseGuards(JwtAuthGuard)
@Controller('campanha-projeto-tipo')
export class CampanhaProjetoTipoController {
  constructor(private readonly service: CampanhaProjetoTipoService) {}

  @Post()
  create(@Body() createCampanhaProjetoTipo: CreateCampanhaProjetoTipo) {
    return this.service.create(createCampanhaProjetoTipo);
  }

  @Get()
  findProjetosTipo() {
    return this.service.findProjetos();
  }

  @Get(':id')
  findByProjetos(@Param('id') id: string) {
    return this.service.findRelacaoByProjeto(+id);
  }
}
