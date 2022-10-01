import { Controller, Get, Param } from '@nestjs/common';
import { LookaheadService } from './lookahead.service';

@Controller('lookahead')
export class LookaheadController {
  constructor(private readonly lookaheadService: LookaheadService) {}

  @Get('projetos')
  async GetProjetos() {
    return await this.lookaheadService.projetosComAtividades();
  }

  @Get('/atividades/:id')
  async GetAtividades(@Param('id') id: string) {
    return await this.lookaheadService.atividadesPorProjeto(id);
  }
}
