import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateEstatisticaDto } from './dto/create-estatistica.dto';
import { EstatisticaDto } from './dto/update-estatistica.dto';
import { EstatisticasService } from './estatisticas.service';

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

  @Patch('projetos/:id')
  apagarAtividade(@Param('id') id: string) {
    return this.estatisticasService.apagarAtividade(+id);
  }
}
