import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProjetosRankingDto } from './dto/create-projetos-ranking.dto';
import { ProjetosRankingService } from './projetos-ranking.service';

@Controller('projetos-ranking')
export class ProjetosRankingController {
  constructor(
    private readonly projetosRankingService: ProjetosRankingService,
  ) {}

  @Post()
  create(@Body() createProjetosRankingDto: CreateProjetosRankingDto) {
    return this.projetosRankingService.create(createProjetosRankingDto);
  }

  @Get()
  findAll() {
    return this.projetosRankingService.findAll();
  }

  @Get('projetos')
  findProjetos() {
    return this.projetosRankingService.findProjetos();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.projetosRankingService.findOne(+id);
  }

  @Patch(':id/:campo/:valor:/:user')
  update(
    @Param('id') id: string,
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Param('user') user: string,
  ) {
    return this.projetosRankingService.update(+id, campo, valor, user);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.projetosRankingService.remove(+id, user);
  }
}
