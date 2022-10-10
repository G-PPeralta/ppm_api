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

  @Get('/atividade/:id')
  async GetAtividade(@Param('id') id: string) {
    return await this.lookaheadService.atividade(id);
  }

  @Get('/ferramentas-servicos/:id')
  async GetFerramentasServicos(@Param('id') id: string) {
    return await this.lookaheadService.getFerramentaServico(id);
  }
}
