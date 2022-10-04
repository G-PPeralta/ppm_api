import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateEstatistica } from './dto/update-estatistica.dto';
import { EstatisticasService } from './estatisticas.service';

@Controller('estatisticas')
export class EstatisticasController {
  constructor(private readonly estatisticasService: EstatisticasService) {}

  @Get('projetos')
  estatisticasCampanha() {
    return this.estatisticasService.estatisticasProjeto();
  }

  @Patch('projetos')
  updateProjetosEstatistica(@Body() updateEstatistica: UpdateEstatistica) {
    return this.estatisticasService.updateProjetosEstatistica(
      updateEstatistica,
    );
  }
}
