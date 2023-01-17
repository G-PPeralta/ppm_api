/**
 * CRIADO EM: 28/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: ENDPOINTS DE CRIAÇÃO E LISTAGEM DE TAREFAS.
 * TAREFAS SÃO CRIADAS NA TELA DE DETALHAMENTO DE UM PROJETO
 * SÃO RELACIONADAS A ATIVIDADES DE UM PROJETO (CADA ATIVIDADE PODE TER UMA OU MAIS TAREFAS)
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateTarefas } from './dto/create-tarefas.dto';
import { TarefasService } from './tarefas.service';

@UseGuards(JwtAuthGuard)
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get()
  findAll() {
    return this.tarefasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarefasService.findOne(+id);
  }

  @Get('/projeto/:id')
  findByProjeto(@Param('id') id: string) {
    return this.tarefasService.findByProjeto(+id);
  }

  @Post()
  create(@Body() createTarefas: CreateTarefas) {
    return this.tarefasService.create(createTarefas);
  }

  @Patch(':id/:campo/:valor/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.tarefasService.update(+id, campo, valor, user);
  }

  @Delete(':id/:user')
  delete(@Param('id') id: string, @Param('user') user: string) {
    return this.tarefasService.delete(+id, user);
  }
}
