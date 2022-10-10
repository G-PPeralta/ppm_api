import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
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
  vincularAtividade(@Body() vincularAtividade: EstatisticaDto) {
    return this.estatisticasService.vincularAtividade(vincularAtividade);
  }
}
