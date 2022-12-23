import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { OperacaoIntervencaoService } from './operacao-intervencao.service';

@UseGuards(JwtAuthGuard)
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
