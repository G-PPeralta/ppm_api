import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRankingOpcoesDto } from './dto/create-ranking-opcoes.dto';
import { RankingsOpcoesService } from './rankings-opcoes.service';

@Controller('rankings-opcoes')
export class RankingsOpcoesController {
  constructor(private readonly rankingOpcoesService: RankingsOpcoesService) {}

  @Post()
  create(createRankingOpcoesDto: CreateRankingOpcoesDto) {
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

  @Patch(':id/:campo/:valor:/:user')
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
