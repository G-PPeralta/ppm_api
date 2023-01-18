/**
 * CRIADO EM: 20/09/2022
 * AUTOR: GABRIEL PERALTA
 * DESCRIÇÃO: Endpoints que criam, listam e atualizam o ranking. Ranking determina a ordem de prioridade de um projeto. Projetos prioritários aparecerão em primeiro na listagem que existe no front-end
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
import { CreateRankingDto } from './dto/create-ranking.dto';
import { RankingsService } from './rankings.service';

@UseGuards(JwtAuthGuard)
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingService: RankingsService) {}

  @Post()
  create(@Body() createRanking: CreateRankingDto) {
    return this.rankingService.create(createRanking);
  }

  @Get()
  findAll() {
    return this.rankingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingService.findOne(+id);
  }

  @Patch(':id/:campo/:valor:/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.rankingService.update(+id, campo, valor, user);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.rankingService.remove(+id, user);
  }
}
