import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { EstatisticasIntervencoesService } from './estatisticas-intervencoes.service';

//@UseGuards(JwtAuthGuard)
@Controller('estatisticas-intervencoes')
export class EstatisticasIntervencoesController {
  constructor(
    private readonly estatisticasService: EstatisticasIntervencoesService,
  ) {}

  @Get('/atividades/:id')
  async cardAtivEstatistica(@Param('id') id: string) {
    return this.estatisticasService.percentCardAtiv(id);
  }

  @Get('/poco/:id')
  async cardPocoEstatistica(@Param('id') id: string) {
    return this.estatisticasService.percentCardPoco(id);
  }
}
