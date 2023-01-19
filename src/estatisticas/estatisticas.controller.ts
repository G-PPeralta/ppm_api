/**
 *  CRIADO EM: 16/11/2022
 *  AUTOR: Felipe Mateus
 *  DESCRIÇÃO DO ARQUIVO: Controle informações pertinestes a estatisticas
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
import { CreateEstatisticaDto } from './dto/create-estatistica.dto';
import { EstatisticaDto } from './dto/update-estatistica.dto';
import { EstatisticasService } from './estatisticas.service';

@UseGuards(JwtAuthGuard)
@Controller('estatisticas')
export class EstatisticasController {
  constructor(private readonly estatisticasService: EstatisticasService) {}

  @Get('projetos')
  estatisticasCampanha() {
    return this.estatisticasService.estatisticasProjeto();
  }

  @Patch('projetos')
  updateProjetosEstatistica(@Body() updateEstatistica: EstatisticaDto) {
    return this.estatisticasService.updateProjetosEstatistica(
      updateEstatistica,
    );
  }

  @Post('projetos')
  vincularAtividade(@Body() vincularAtividade: CreateEstatisticaDto) {
    return this.estatisticasService.vincularAtividade(vincularAtividade);
  }

  @Delete('projetos/:id/:user')
  apagarAtividade(@Param('id') id: string, @Param('user') user: string) {
    return this.estatisticasService.apagarAtividade(+id, user);
  }
}
