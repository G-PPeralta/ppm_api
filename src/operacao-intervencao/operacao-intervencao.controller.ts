import { Controller } from '@nestjs/common';
import { OperacaoIntervencaoService } from './operacao-intervencao.service';

@Controller('operacao-intervencao')
export class OperacaoIntervencaoController {
  constructor(
    private readonly operacaoIntervencaoService: OperacaoIntervencaoService,
  ) {}

  findAll() {
    return this.operacaoIntervencaoService.findAll();
  }
}
