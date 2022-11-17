import { Controller, Param, Patch } from '@nestjs/common';
import { OperacaoIntervencaoService } from './operacao-intervencao.service';

@Controller('operacao-intervencao')
export class OperacaoIntervencaoController {
  constructor(
    private readonly operacaoIntervencaoService: OperacaoIntervencaoService,
  ) {}

  findAll() {
    return this.operacaoIntervencaoService.findAll();
  }

  @Patch(':id')
  delete(@Param('id') id: string) {
    return this.operacaoIntervencaoService.delete(+id);
  }
}
