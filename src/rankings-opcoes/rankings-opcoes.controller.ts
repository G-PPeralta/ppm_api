/**
 * CRIADO EM: 20/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Endpoints que criam, listam e atualizam as opções do ranking. Ranking determina a ordem de prioridade de um projeto. Projetos prioritários aparecerão em primeiro na listagem que existe no front-end
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
import { CreateRankingOpcoesDto } from './dto/create-ranking-opcoes.dto';
import { RankingsOpcoesService } from './rankings-opcoes.service';

@UseGuards(JwtAuthGuard)
@Controller('rankings-opcoes')
export class RankingsOpcoesController {
  constructor(private readonly rankingOpcoesService: RankingsOpcoesService) {}

  @Post()
  create(@Body() createRankingOpcoesDto: CreateRankingOpcoesDto) {
    return this.rankingOpcoesService.create(createRankingOpcoesDto);
  }

  @Get()
  findAll() {
    return this.rankingOpcoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingOpcoesService.findOne(+id);
  }

  @Patch(':id/:campo/:valor/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.rankingOpcoesService.update(+id, campo, valor, user);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.rankingOpcoesService.remove(+id, user);
  }
}
