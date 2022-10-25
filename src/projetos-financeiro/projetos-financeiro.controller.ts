import { Controller, Get, Param } from '@nestjs/common';
import { ProjetosFinanceiroService } from './projetos-financeiro.service';

@Controller('projetos-financeiro')
export class ProjetosFinanceiroController {
  constructor(
    private readonly projetosFinanceiroService: ProjetosFinanceiroService,
  ) {}

  @Get('pai')
  findPais() {
    return this.projetosFinanceiroService.findPais();
  }

  @Get('filhos/:id/:mes')
  findFilhos(@Param('id') id: string, @Param('mes') mes: string) {
    return this.projetosFinanceiroService.findFilhos(+id, mes);
  }
}
