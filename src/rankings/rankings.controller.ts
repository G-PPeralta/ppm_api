import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingService: RankingsService) {}

  @Post()
  create(createRanking: CreateRankingDto) {
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
